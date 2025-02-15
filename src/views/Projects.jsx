"use client"

import { useContext, useState } from "react"
import Card from "../components/Card"
import { ThemeContext } from "../themeProvider"
import { projectsData } from "../constants"

const Projects = () => {
  const theme = useContext(ThemeContext)
  const darkMode = theme.state.darkMode
  const [visibleProjects, setVisibleProjects] = useState(9)

  const showMoreProjects = () => {
    setVisibleProjects((prevVisible) => prevVisible + 10)
  }

  return (
    <div id="projects" className={darkMode ? "bg-white text-black" : "bg-gray-900 text-white"}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <h2 className="text-5xl font-bold px-4 md:px-0 text-center">Projects</h2>
        <h4 className="mt-16 text-3xl font-semibold text-blue-600">What I Built</h4>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projectsData.slice(0, visibleProjects).map((project, index) => (
            <Card key={index} item={project} />
          ))}
        </div>
        {projectsData.length > visibleProjects && (
          <button onClick={showMoreProjects} className="mx-auto mt-8 flex items-center">
            Show More
            <svg
              className="ml-2 -mr-1 w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

export default Projects

