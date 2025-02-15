"use client"

import { useState } from "react"
import { motion } from "framer-motion"

const Card = ({ item }) => {
  const [showFullDescription, setShowFullDescription] = useState(false)

  const handleReadMoreClick = () => {
    setShowFullDescription(!showFullDescription)
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      variants={{
        visible: { opacity: 1 },
        hidden: { opacity: 0 },
      }}
      className="max-w-xl bg-white rounded-lg border border-gray-200 shadow-lg dark:bg-gray-800 dark:border-gray-700 my-8"
    >
      <a href={item.link}>
        <img className="rounded-t-lg h-80 w-full" src={item.image || "/placeholder.svg"} alt={item?.name} />
      </a>
      <div className="p-5">
        <a href="#">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{item.name}</h5>
        </a>
        <p className={`mb-3 font-normal text-gray-700 dark:text-gray-400 ${showFullDescription ? "" : "line-clamp-2"}`}>
          {item.description}
        </p>
        <button
          onClick={handleReadMoreClick}
          className="inline-flex items-center py-2 px-3 text-sm font-medium text-center text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300"
        >
          {showFullDescription ? "Show less" : "Read more"}
          <svg
            className={`ml-2 -mr-1 w-4 h-4 transition-transform ${showFullDescription ? "rotate-180" : ""}`}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>
      </div>
    </motion.div>
  )
}

export default Card

