import pypdf  # Modern PDF parser
import spacy
import re
from typing import Dict, List, Any, BinaryIO
import docx
from app.models.resume import Resume, Contact, Education, Experience, Skill
from skillNer.general_params import SKILL_DB
from skillNer.skill_extractor_class import SkillExtractor

# Load spaCy model
try:
    nlp = spacy.load("en_core_web_sm")
except:
    # If model not found, download it
    import os
    os.system("python -m spacy download en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

# Initialize skill extractor
skill_extractor = SkillExtractor(nlp, SKILL_DB, PhraseMatcher=True)

class ResumeParser:
    def __init__(self):
        self.nlp = nlp
        self.skill_extractor = skill_extractor

    async def parse_resume(self, file: BinaryIO, filename: str) -> Resume:
        """Parse resume from uploaded file (PDF or DOCX)"""
        text = ""

        if filename.lower().endswith('.pdf'):
            text = self._extract_text_from_pdf(file)
        elif filename.lower().endswith('.docx'):
            text = self._extract_text_from_docx(file)
        else:
            raise ValueError("Unsupported file format. Please upload PDF or DOCX.")

        # Parse resume sections
        parsed_data = self._parse_resume_text(text)

        # Create Resume object
        resume = Resume(
            name=parsed_data.get("name", ""),
            contact=Contact(**parsed_data.get("contact", {})),
            summary=parsed_data.get("summary", ""),
            skills=[Skill(name=skill) for skill in parsed_data.get("skills", [])],
            experience=[Experience(**exp) for exp in parsed_data.get("experience", [])],
            education=[Education(**edu) for edu in parsed_data.get("education", [])]
        )

        return resume

    def _extract_text_from_pdf(self, file: BinaryIO) -> str:
        """Extract text from PDF file using pypdf"""
        try:
            # Save the file content to a temporary variable
            file_content = file.read()

            # Create a PDF reader object
            reader = pypdf.PdfReader(file_content)

            # Extract text from each page
            text = ""
            for page in reader.pages:
                text += page.extract_text() + "\n"

            return text
        except Exception as e:
            print(f"Error parsing PDF: {str(e)}")
            return "Error parsing PDF. Please try uploading a DOCX file instead."

    def _extract_text_from_docx(self, file: BinaryIO) -> str:
        """Extract text from DOCX file"""
        doc = docx.Document(file)
        text = ""

        for paragraph in doc.paragraphs:
            text += paragraph.text + "\n"

        return text

    def _parse_resume_text(self, text: str) -> Dict[str, Any]:
        """Parse resume text into structured data"""
        # Process text with spaCy
        doc = self.nlp(text)

        # Extract data
        parsed_data = {
            "name": self._extract_name(doc, text),
            "contact": self._extract_contact_info(text),
            "summary": self._extract_summary(text),
            "skills": self._extract_skills(doc),
            "experience": self._extract_experience(text),
            "education": self._extract_education(text)
        }

        return parsed_data

    def _extract_name(self, doc, text: str) -> str:
        """Extract name from resume"""
        # Simple approach: first PERSON entity is likely the name
        for ent in doc.ents:
            if ent.label_ == "PERSON":
                return ent.text

        # Fallback: first line might be the name
        first_line = text.strip().split('\n')[0]
        if len(first_line) < 50:  # Reasonable name length
            return first_line

        return ""

    def _extract_contact_info(self, text: str) -> Dict[str, str]:
        """Extract contact information"""
        contact = {}

        # Email
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        email_match = re.search(email_pattern, text)
        if email_match:
            contact["email"] = email_match.group()

        # Phone
        phone_pattern = r'(\+\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}'
        phone_match = re.search(phone_pattern, text)
        if phone_match:
            contact["phone"] = phone_match.group()

        # LinkedIn
        linkedin_pattern = r'linkedin\.com/in/[A-Za-z0-9_-]+'
        linkedin_match = re.search(linkedin_pattern, text)
        if linkedin_match:
            contact["linkedin"] = "https://" + linkedin_match.group()

        # GitHub
        github_pattern = r'github\.com/[A-Za-z0-9_-]+'
        github_match = re.search(github_pattern, text)
        if github_match:
            contact["github"] = "https://" + github_match.group()

        return contact

    def _extract_summary(self, text: str) -> str:
        """Extract summary/objective section"""
        summary_patterns = [
            r'(?i)(?:SUMMARY|PROFESSIONAL SUMMARY|PROFILE|OBJECTIVE)[:\s]*(.*?)(?:\n\n|\Z)',
            r'(?i)(?:ABOUT ME)[:\s]*(.*?)(?:\n\n|\Z)'
        ]

        for pattern in summary_patterns:
            match = re.search(pattern, text, re.DOTALL)
            if match:
                return match.group(1).strip()

        return ""

    def _extract_skills(self, doc) -> List[str]:
        """Extract skills using skillNer"""
        annotations = self.skill_extractor.annotate(doc)
        skills = []

        # Extract skills from annotations
        for match in annotations['results']['full_matches']:
            skills.append(match['doc_node_value'])

        # Add partial matches with high confidence
        for match in annotations['results']['ngram_scored']:
            if match['score'] > 0.7:  # Only high confidence matches
                skills.append(match['doc_node_value'])

        return list(set(skills))  # Remove duplicates

    def _extract_experience(self, text: str) -> List[Dict[str, str]]:
        """Extract work experience"""
        # This is a simplified implementation
        # A more robust solution would use regex patterns to identify company, title, dates
        experience_section = self._extract_section(text,
            ['EXPERIENCE', 'WORK EXPERIENCE', 'EMPLOYMENT HISTORY', 'PROFESSIONAL EXPERIENCE'])

        if not experience_section:
            return []

        # Simple parsing - split by newlines and look for patterns
        experiences = []
        lines = experience_section.split('\n')
        current_exp = {}

        for line in lines:
            line = line.strip()
            if not line:
                continue

            # Check if this is a new experience entry (usually starts with company or title)
            if re.match(r'^[A-Z][a-zA-Z\s]+', line) and not line.startswith('•'):
                if current_exp and 'company' in current_exp:
                    experiences.append(current_exp)
                    current_exp = {}

                # Try to extract company and title
                parts = line.split(' - ')
                if len(parts) >= 2:
                    current_exp['company'] = parts[0].strip()
                    current_exp['title'] = parts[1].strip()
                else:
                    current_exp['company'] = line

            # Look for dates
            date_pattern = r'(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}\s*[-–]\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}|Present'
            date_match = re.search(date_pattern, line)
            if date_match and 'company' in current_exp:
                dates = date_match.group().split('–')
                if len(dates) == 2:
                    current_exp['start_date'] = dates[0].strip()
                    current_exp['end_date'] = dates[1].strip()

            # Description usually starts with bullet points
            if line.startswith('•') and 'company' in current_exp:
                if 'description' not in current_exp:
                    current_exp['description'] = line
                else:
                    current_exp['description'] += '\n' + line

        # Add the last experience
        if current_exp and 'company' in current_exp:
            experiences.append(current_exp)

        return experiences

    def _extract_education(self, text: str) -> List[Dict[str, str]]:
        """Extract education information"""
        education_section = self._extract_section(text,
            ['EDUCATION', 'ACADEMIC BACKGROUND', 'EDUCATIONAL BACKGROUND'])

        if not education_section:
            return []

        # Simple parsing - split by newlines and look for patterns
        educations = []
        lines = education_section.split('\n')
        current_edu = {}

        for line in lines:
            line = line.strip()
            if not line:
                continue

            # Check if this is a new education entry
            if re.match(r'^[A-Z][a-zA-Z\s]+', line) and not line.startswith('•'):
                if current_edu and 'institution' in current_edu:
                    educations.append(current_edu)
                    current_edu = {}

                current_edu['institution'] = line

            # Look for degree
            degree_pattern = r'(Bachelor|Master|PhD|B\.S\.|M\.S\.|B\.A\.|M\.A\.|Ph\.D\.|MBA|MD|JD)'
            degree_match = re.search(degree_pattern, line)
            if degree_match and 'institution' in current_edu:
                current_edu['degree'] = line

            # Look for dates
            date_pattern = r'\b(19|20)\d{2}\s*[-–]\s*(19|20)\d{2}|Present'
            date_match = re.search(date_pattern, line)
            if date_match and 'institution' in current_edu:
                dates = date_match.group().split('–')
                if len(dates) == 2:
                    current_edu['start_date'] = dates[0].strip()
                    current_edu['end_date'] = dates[1].strip()

        # Add the last education
        if current_edu and 'institution' in current_edu:
            educations.append(current_edu)

        return educations

    def _extract_section(self, text: str, section_headers: List[str]) -> str:
        """Extract a section from the resume text based on headers"""
        for header in section_headers:
            pattern = rf'(?i){header}[:\s]*\n(.*?)(?:\n\s*[A-Z][A-Z\s]+[:\s]*\n|\Z)'
            match = re.search(pattern, text, re.DOTALL)
            if match:
                return match.group(1).strip()

        return ""
