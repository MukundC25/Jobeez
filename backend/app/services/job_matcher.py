from typing import List, Dict, Tuple
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import spacy
from collections import Counter

class JobMatcher:
    def __init__(self):
        # Initialize sentence transformer model
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        # Load spaCy for skill extraction
        self.nlp = spacy.load("en_core_web_lg")
        
    def match_jobs(self, resume_data: Dict, jobs: List[Dict], top_k: int = 10) -> List[Dict]:
        """
        Match resume against job listings and return top matches with scores.
        
        Args:
            resume_data: Dictionary containing parsed resume data
            jobs: List of job dictionaries
            top_k: Number of top matches to return
            
        Returns:
            List of job matches with scores and matched skills
        """
        # Extract skills from resume
        resume_skills = set(resume_data['skills'])
        
        # Prepare resume text for embedding
        resume_text = self._prepare_resume_text(resume_data)
        resume_embedding = self.model.encode([resume_text])[0]
        
        # Prepare job texts and get embeddings
        job_texts = [self._prepare_job_text(job) for job in jobs]
        job_embeddings = self.model.encode(job_texts)
        
        # Calculate similarity scores
        similarities = cosine_similarity([resume_embedding], job_embeddings)[0]
        
        # Get matched jobs with scores
        job_matches = []
        for idx, (job, similarity) in enumerate(zip(jobs, similarities)):
            # Extract skills from job description
            job_skills = self._extract_skills_from_text(job['description'])
            
            # Calculate skill overlap
            skill_overlap = resume_skills.intersection(job_skills)
            skill_overlap_score = len(skill_overlap) / len(job_skills) if job_skills else 0
            
            # Calculate final score (weighted combination of semantic similarity and skill overlap)
            final_score = 0.7 * similarity + 0.3 * skill_overlap_score
            
            # Get missing skills that could improve the match
            missing_skills = job_skills - resume_skills
            
            job_matches.append({
                'job': job,
                'score': float(final_score),
                'semantic_similarity': float(similarity),
                'skill_overlap_score': float(skill_overlap_score),
                'matched_skills': list(skill_overlap),
                'missing_skills': list(missing_skills),
                'improvement_suggestions': self._generate_improvement_suggestions(
                    missing_skills, final_score, similarity, skill_overlap_score
                )
            })
        
        # Sort by final score and return top_k matches
        job_matches.sort(key=lambda x: x['score'], reverse=True)
        return job_matches[:top_k]
    
    def _prepare_resume_text(self, resume_data: Dict) -> str:
        """Prepare resume text for embedding by combining relevant sections."""
        sections = []
        
        if resume_data.get('name'):
            sections.append(f"Name: {resume_data['name']}")
        
        if resume_data.get('skills'):
            sections.append(f"Skills: {', '.join(resume_data['skills'])}")
            
        if resume_data.get('experience'):
            exp_text = "Experience: "
            for exp in resume_data['experience']:
                if isinstance(exp, dict):
                    exp_text += f"{exp.get('title', '')} at {exp.get('company', '')}. "
                    if exp.get('description'):
                        exp_text += f"{exp['description']} "
            sections.append(exp_text)
            
        if resume_data.get('education'):
            edu_text = "Education: "
            for edu in resume_data['education']:
                if isinstance(edu, dict):
                    edu_text += f"{edu.get('degree', '')} from {edu.get('institution', '')}. "
            sections.append(edu_text)
            
        return " ".join(sections)
    
    def _prepare_job_text(self, job: Dict) -> str:
        """Prepare job text for embedding by combining relevant fields."""
        sections = []
        
        if job.get('title'):
            sections.append(f"Title: {job['title']}")
            
        if job.get('company'):
            sections.append(f"Company: {job['company']}")
            
        if job.get('description'):
            sections.append(f"Description: {job['description']}")
            
        if job.get('requirements'):
            sections.append(f"Requirements: {job['requirements']}")
            
        return " ".join(sections)
    
    def _extract_skills_from_text(self, text: str) -> set:
        """Extract skills from text using spaCy NER and noun chunks."""
        doc = self.nlp(text)
        skills = set()
        
        # Extract noun phrases that might be skills
        for chunk in doc.noun_chunks:
            if len(chunk.text.split()) <= 3:  # Skills are usually 1-3 words
                skills.add(chunk.text.lower())
        
        # Extract named entities that might be skills
        for ent in doc.ents:
            if ent.label_ in ['PRODUCT', 'ORG', 'WORK_OF_ART']:
                skills.add(ent.text.lower())
        
        return skills
    
    def _generate_improvement_suggestions(
        self, 
        missing_skills: set, 
        final_score: float,
        semantic_similarity: float,
        skill_overlap_score: float
    ) -> List[str]:
        """Generate suggestions to improve job match score."""
        suggestions = []
        
        if final_score < 0.7:
            if semantic_similarity < 0.6:
                suggestions.append("Consider highlighting more relevant experience in your resume that matches the job description.")
            
            if skill_overlap_score < 0.5 and missing_skills:
                # Get top 3 most important missing skills
                top_missing = list(missing_skills)[:3]
                suggestions.append(f"Consider adding experience with: {', '.join(top_missing)}")
                
            if len(missing_skills) > 3:
                suggestions.append(f"There are {len(missing_skills)} skills mentioned in the job that you could highlight or acquire.")
        
        return suggestions 