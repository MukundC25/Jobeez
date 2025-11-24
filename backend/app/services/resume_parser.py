import pypdf  # Modern PDF parser
import spacy
import re
from typing import Dict, List, Any, BinaryIO, Optional
import docx
from app.models.resume import Resume, Contact, Education, Experience, Skill
from skillNer.general_params import SKILL_DB
from skillNer.skill_extractor_class import SkillExtractor
from pathlib import Path

# Load spaCy model
try:
    nlp = spacy.load("en_core_web_lg")
except:
    # If model not found, download it
    import os
    os.system("python -m spacy download en_core_web_lg")
    nlp = spacy.load("en_core_web_lg")

# Initialize skill extractor
skill_extractor = SkillExtractor(nlp, SKILL_DB, PhraseMatcher=nlp.matcher)

class ResumeParser:
    def __init__(self):
        self.nlp = nlp
        self.skill_extractor = skill_extractor

    def parse_resume(self, file_path: str) -> Dict:
        """Parse resume and extract key information."""
        file_extension = Path(file_path).suffix.lower()
        
        if file_extension == '.pdf':
            text = self._extract_text_from_pdf(file_path)
        elif file_extension in ['.docx', '.doc']:
            text = self._extract_text_from_docx(file_path)
        else:
            raise ValueError(f"Unsupported file format: {file_extension}")
            
        # Process text with spaCy
        doc = self.nlp(text)
        
        # Extract information
        parsed_data = {
            'name': self._extract_name(doc),
            'email': self._extract_email(text),
            'phone': self._extract_phone(text),
            'skills': self._extract_skills(doc),
            'experience': self._extract_experience(doc),
            'education': self._extract_education(doc),
            'raw_text': text
        }
        
        return parsed_data

    def _extract_text_from_pdf(self, file_path: str) -> str:
        """Extract text from PDF file."""
        reader = pypdf.PdfReader(file_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text

    def _extract_text_from_docx(self, file_path: str) -> str:
        """Extract text from DOCX file."""
        doc = docx.Document(file_path)
        return "\n".join([paragraph.text for paragraph in doc.paragraphs])

    def _extract_name(self, doc) -> Optional[str]:
        """Extract name using NER."""
        for ent in doc.ents:
            if ent.label_ == "PERSON":
                return ent.text
        return None

    def _extract_email(self, text: str) -> Optional[str]:
        """Extract email using regex."""
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        match = re.search(email_pattern, text)
        return match.group(0) if match else None

    def _extract_phone(self, text: str) -> Optional[str]:
        """Extract phone number using regex."""
        phone_pattern = r'\+?1?\s*\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}'
        match = re.search(phone_pattern, text)
        return match.group(0) if match else None

    def _extract_skills(self, doc) -> List[str]:
        """Extract skills using skillNer."""
        annotations = self.skill_extractor.annotate(doc)
        skills = []
        
        # Extract full matches
        for skill in annotations['results']['full_matches']:
            skills.append(skill['doc_node_value'])
            
        # Extract ngram matches
        for skill in annotations['results']['ngram_scored']:
            if skill['score'] > 0.8:  # Only include high confidence matches
                skills.append(skill['doc_node_value'])
                
        return list(set(skills))  # Remove duplicates

    def _extract_experience(self, doc) -> List[Dict]:
        """Extract work experience using NER and pattern matching."""
        experience = []
        # Look for date patterns and company names
        for ent in doc.ents:
            if ent.label_ in ["ORG", "DATE"]:
                # TODO: Implement more sophisticated experience extraction
                # This is a basic implementation
                pass
        return experience

    def _extract_education(self, doc) -> List[Dict]:
        """Extract education information using NER and pattern matching."""
        education = []
        # Look for educational institutions and degrees
        for ent in doc.ents:
            if ent.label_ in ["ORG"]:
                # TODO: Implement more sophisticated education extraction
                # This is a basic implementation
                pass
        return education

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

    def _extract_section(self, text: str, section_headers: List[str]) -> str:
        """Extract a section from the resume text based on headers"""
        for header in section_headers:
            pattern = rf'(?i){header}[:\s]*\n(.*?)(?:\n\s*[A-Z][A-Z\s]+[:\s]*\n|\Z)'
            match = re.search(pattern, text, re.DOTALL)
            if match:
                return match.group(1).strip()

        return ""
