import { useState } from 'react'

const SkillsSection = ({ skills, title = "Skills", showCategories = false }) => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  
  // Group skills by category if showCategories is true
  const groupedSkills = showCategories 
    ? skills.reduce((acc, skill) => {
        const category = skill.category || 'Other'
        if (!acc[category]) {
          acc[category] = []
        }
        acc[category].push(skill)
        return acc
      }, {})
    : { 'All': skills }
  
  // Get unique categories
  const categories = showCategories 
    ? ['all', ...Object.keys(groupedSkills)]
    : ['all']
  
  // Filter skills by selected category
  const filteredSkills = selectedCategory === 'all'
    ? skills
    : groupedSkills[selectedCategory] || []

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
        {title}
      </h3>
      
      {showCategories && categories.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`text-xs px-3 py-1 rounded-full transition-colors ${
                selectedCategory === category
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      )}
      
      <div className="flex flex-wrap gap-2">
        {filteredSkills.map((skill, index) => (
          <div 
            key={index}
            className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 px-3 py-1 rounded-full text-sm"
          >
            {skill.name}
            {skill.level && (
              <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                ({skill.level})
              </span>
            )}
          </div>
        ))}
        
        {filteredSkills.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400 text-sm">No skills found in this category</p>
        )}
      </div>
    </div>
  )
}

export default SkillsSection
