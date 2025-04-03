import { useState } from 'react'
import './App.css'
import BasicValidation from './lessons/Lesson1-BasicValidation'
import AdvancedValidation from './lessons/Lesson2-AdvancedValidation'
import AsyncValidation from './lessons/Lesson3-AsyncValidation'
import NestedValidation from './lessons/Lesson4-NestedValidation'

  const lessons = [
    { id: 1, title: 'Basic Validation', component: <BasicValidation /> },
    { id: 2, title: 'Advanced Validation', component: <AdvancedValidation /> },
    { id: 3, title: 'Async Validation', component: <AsyncValidation /> },
    { id: 4, title: 'Nested Objects & Arrays', component: <NestedValidation /> },
  ]

function App() {
  const [selectedLesson, setSelectedLesson] = useState<number>(1)

  return (
    <div className="app-container">
      <header>
        <h1>Form Validation in React using React Hook Form and Zod</h1>
      </header>

      <div className="lesson-selector-container">
        <div className="lesson-selector">
          {lessons.map(lesson => (
            <button 
              key={lesson.id}
              className={selectedLesson === lesson.id ? 'active' : ''} 
              onClick={() => setSelectedLesson(lesson.id)}
            >
              <span className="lesson-number">{lesson.id}</span>
              <span className="lesson-title">{lesson.title}</span>
            </button>
          ))}
        </div>
      </div>

      <main className="content-card">
        {lessons.find(lesson => lesson.id === selectedLesson)?.component}
      </main>

      <footer>
        <p>Demo on Form Validation in React using React Hook Form and Zod</p>
      </footer>
    </div>
  )
}

export default App
