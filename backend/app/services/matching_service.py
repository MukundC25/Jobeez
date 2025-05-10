from typing import List, Dict, Any
from sentence_transformers import SentenceTransformer
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from app.models.resume import Resume
from app.models.job import JobListing, JobMatch, JobSkill
from app.services.job_service import JobService

class MatchingService:
    def __init__(self):
        # Load sentence transformer model
        try:
            self.model = SentenceTransformer('all-MiniLM-L6-v2')
        except:
            # If model not found, download it
            import os
            os.system("pip install -U sentence-transformers")
            self.model = SentenceTransformer('all-MiniLM-L6-v2')

        self.job_service = JobService()

    async def match_resume_to_jobs(self, resume: Resume, limit: int = 10) -> List[JobMatch]:
        """Match resume to jobs and return top matches"""
        # Get all job listings
        job_listings = await self.job_service.get_job_listings(limit=100)

        # Extract resume skills
        resume_skills = [skill.name.lower() for skill in resume.skills]

        # Calculate match scores for each job
        job_matches = []
        for job in job_listings:
            # Extract job skills
            job_skills = [skill.name.lower() for skill in job.skills]

            # Calculate skill overlap
            matched_skills = [skill for skill in resume_skills if skill in job_skills]
            missing_skills = [skill for skill in job_skills if skill not in resume_skills]

            # Calculate match score based on skill overlap
            if len(job_skills) > 0:
                skill_match_score = len(matched_skills) / len(job_skills) * 100
            else:
                skill_match_score = 0

            # Calculate semantic similarity between resume and job description
            resume_text = self._get_resume_text(resume)
            job_text = job.description

            semantic_score = self._calculate_semantic_similarity(resume_text, job_text) * 100

            # Combine scores (70% skill match, 30% semantic match)
            match_score = 0.7 * skill_match_score + 0.3 * semantic_score

            # Generate match reasoning
            match_reasoning = self._generate_match_reasoning(
                resume, job, matched_skills, missing_skills, match_score)

            # Create JobMatch object
            job_match = JobMatch(
                job=job,
                match_score=round(match_score, 2),
                matched_skills=matched_skills,
                missing_skills=missing_skills,
                match_reasoning=match_reasoning,
                best_fit=False  # Will be set later
            )

            job_matches.append(job_match)

        # Sort by match score (descending)
        job_matches.sort(key=lambda x: x.match_score, reverse=True)

        # Mark top matches as "best fit"
        for i in range(min(3, len(job_matches))):
            job_matches[i].best_fit = True

        # Return top matches
        return job_matches[:limit]

    async def get_resume_improvement_suggestions(self, resume: Resume) -> Dict[str, Any]:
        """Generate suggestions to improve resume for better job matches"""
        # Get all job listings
        job_listings = await self.job_service.get_job_listings(limit=100)

        # Extract resume skills
        resume_skills = [skill.name.lower() for skill in resume.skills]

        # Count skill frequency across all jobs
        skill_frequency = {}
        for job in job_listings:
            for skill in job.skills:
                skill_name = skill.name.lower()
                if skill_name not in skill_frequency:
                    skill_frequency[skill_name] = 0
                skill_frequency[skill_name] += 1

        # Find most common missing skills
        missing_skills = []
        for skill, frequency in sorted(skill_frequency.items(), key=lambda x: x[1], reverse=True):
            if skill not in resume_skills and frequency > 5:  # Only suggest skills that appear in multiple jobs
                missing_skills.append(skill)

        # Limit to top 10 missing skills
        missing_skills = missing_skills[:10]

        # Calculate potential improvement score
        current_avg_score = 0
        potential_avg_score = 0

        for job in job_listings[:20]:  # Use top 20 jobs for calculation
            job_skills = [skill.name.lower() for skill in job.skills]

            # Current match
            current_matched = [skill for skill in resume_skills if skill in job_skills]
            current_score = len(current_matched) / len(job_skills) if len(job_skills) > 0 else 0

            # Potential match (with added skills)
            potential_skills = resume_skills + missing_skills
            potential_matched = [skill for skill in potential_skills if skill in job_skills]
            potential_score = len(potential_matched) / len(job_skills) if len(job_skills) > 0 else 0

            current_avg_score += current_score
            potential_avg_score += potential_score

        current_avg_score /= 20
        potential_avg_score /= 20

        improvement_percentage = (potential_avg_score - current_avg_score) * 100

        # Generate formatting suggestions
        formatting_suggestions = [
            "Use bullet points for skills and experience to improve readability",
            "Include quantifiable achievements in your experience section",
            "Ensure your contact information is clearly visible at the top",
            "Use a clean, ATS-friendly format with standard section headings",
            "Tailor your resume summary to match your target job roles"
        ]

        # Generate content suggestions
        content_suggestions = [
            "Add a skills section that clearly lists your technical and soft skills",
            "Quantify your achievements with metrics and specific results",
            "Include relevant projects that showcase your skills",
            "Tailor your experience descriptions to highlight relevant skills",
            "Use industry-specific keywords throughout your resume"
        ]

        return {
            "missing_skills": missing_skills,
            "improvement_score": round(improvement_percentage, 2),
            "formatting_suggestions": formatting_suggestions,
            "content_suggestions": content_suggestions
        }

    def _get_resume_text(self, resume: Resume) -> str:
        """Convert resume to text for semantic matching"""
        text = f"{resume.name}\n"

        if resume.summary:
            text += f"{resume.summary}\n\n"

        # Add skills
        text += "Skills: "
        text += ", ".join([skill.name for skill in resume.skills])
        text += "\n\n"

        # Add experience
        for exp in resume.experience:
            text += f"{exp.title} at {exp.company}\n"
            if exp.description:
                text += f"{exp.description}\n"

        # Add education
        for edu in resume.education:
            text += f"{edu.degree} at {edu.institution}\n"

        return text

    def _calculate_semantic_similarity(self, text1: str, text2: str) -> float:
        """Calculate semantic similarity between two texts"""
        # Encode texts
        embedding1 = self.model.encode([text1])[0]
        embedding2 = self.model.encode([text2])[0]

        # Calculate cosine similarity
        similarity = cosine_similarity([embedding1], [embedding2])[0][0]

        return similarity

    def _generate_match_reasoning(self, resume: Resume, job: JobListing,
                                 matched_skills: List[str], missing_skills: List[str],
                                 match_score: float) -> str:
        """Generate reasoning for why a job matches a resume"""
        if match_score >= 80:
            strength = "strong"
        elif match_score >= 60:
            strength = "good"
        elif match_score >= 40:
            strength = "moderate"
        else:
            strength = "limited"

        reasoning = f"You have a {strength} match ({match_score:.1f}%) with this {job.title} position at {job.company}. "

        # Add matched skills
        if matched_skills:
            reasoning += f"Your skills in {', '.join(matched_skills[:5])} "
            if len(matched_skills) > 5:
                reasoning += f"and {len(matched_skills) - 5} more "
            reasoning += "align well with the job requirements. "

        # Add missing skills
        if missing_skills:
            reasoning += f"To improve your match, consider developing skills in {', '.join(missing_skills[:3])}"
            if len(missing_skills) > 3:
                reasoning += f" and {len(missing_skills) - 3} more areas"
            reasoning += ". "

        # Add experience level match
        if hasattr(resume, 'experience') and job.experience_level:
            exp_years = len(resume.experience)
            if job.experience_level == "Entry Level" and exp_years <= 2:
                reasoning += "Your experience level is well-suited for this entry-level position. "
            elif job.experience_level == "Mid Level" and 2 <= exp_years <= 5:
                reasoning += "Your experience level is appropriate for this mid-level position. "
            elif job.experience_level == "Senior Level" and exp_years >= 5:
                reasoning += "Your experience level matches this senior-level position. "
            elif job.experience_level == "Senior Level" and exp_years < 5:
                reasoning += "This senior-level position may require more experience than your profile indicates. "

        return reasoning
