import React from 'react'

function GradientText({text}) {
  return (
    <h1 className="p-3 text-5xl text-center font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-pink-600">
        {text}
    </h1>
  )
}

export default GradientText