const express = require('express')

const server = express()

server.use(express.json())

const projects = []

// Middleware
function checkIfProjectExists(req, res, next){
  const { id } = req.params

  const project = projects.find(p => p.id === id)

  if(!project){
    return res.status(400).json({ error: "Project not found!" })
  }

  return next()

}

var numberOfRequests = 0

function countRequests(req, res, next){
  
  numberOfRequests++

  console.log(`Número de requisições: ${numberOfRequests}`)

  return next()

}

// Middleware

server.use(countRequests)

server.post('/projects', (req, res) => {

  const { id, title } = req.body

  projects.push({
    id, 
    title,
    tasks: []
  })

  return res.json(projects)

})

server.get('/projects', (req, res) => {
  return res.json(projects)
})

server.put('/projects/:id', checkIfProjectExists, (req, res) => {

  const { id } = req.params
  const { title } = req.body

  const project = projects.find(p => p.id === id)

  project.title = title

  return res.json(projects)

})

server.delete('/projects/:id', checkIfProjectExists, (req, res) => {

  const { id } = req.params

  const projectIndex = projects.findIndex(p => p.id === id)

  projects.splice(projectIndex, 1)

  return res.json(projects)

})

server.post('/projects/:id/tasks', checkIfProjectExists, (req, res) => {

  const { id } = req.params
  const { title } = req.body

  const project = projects.find(p => p.id === id) 
  
  project.tasks.push(title)

  return res.json(projects)

})



server.listen(3000)