import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import Fastify from 'fastify'
import HelloRouter from './hello.js'

describe('Hello Routes', () => {
  const server = Fastify({
    logger: false
  })

  beforeAll(async () => {
    await server.register(HelloRouter)
    await server.ready()
  })

  afterAll(async () => {
    await server.close()
  })

  describe('GET /world', () => {
    it('should return hello world message', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/world'
      })

      expect(response.statusCode).toBe(200)
      const json = response.json()
      expect(json.data).toEqual({
        msg: 'Hello World!',
        name: 'World'
      })
      expect(json.ret).toBe(0)
      expect(json.msg).toBe('ok')
    })

    it('should return personalized greeting with query param', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/world?name=John'
      })

      expect(response.statusCode).toBe(200)
      const json = response.json()
      expect(json.data).toEqual({
        msg: 'Hello John!',
        name: 'John'
      })
    })

    it('should handle special characters in name', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/world?name=Test%20User'
      })

      expect(response.statusCode).toBe(200)
      const json = response.json()
      expect(json.data.msg).toBe('Hello Test User!')
      expect(json.data.name).toBe('Test User')
    })
  })

  describe('GET /info', () => {
    it('should return service information', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/info'
      })

      expect(response.statusCode).toBe(200)
      const json = response.json()
      expect(json.data).toHaveProperty('service', 'Hello Service')
      expect(json.data).toHaveProperty('version', '1.0.0')
      expect(json.data).toHaveProperty('uptime')
      expect(json.data.uptime).toBeGreaterThan(0)
      expect(json.ret).toBe(0)
    })
  })
})

