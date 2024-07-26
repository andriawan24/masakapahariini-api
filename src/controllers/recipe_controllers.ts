import axios, { AxiosError } from 'axios'
import * as cheerio from 'cheerio'
import type { Request, Response } from 'express'
import type { DetailRecipeResponse, IngredientResponse, RecipeResponse } from '../models/response/recipe_response'
import type { GetRecipeQuery, SearchRecipeQuery } from '../models/request/recipe_request'
import { generateErrorResponse, generateResponse } from '../utils/response_utils'
import { parseCookTimeToMinute } from '../utils/time_utils'

export async function getRecipeDetail(req: Request<any, any, any, { url: string }>, res: Response) {
  const { query } = req

  if (!query.url) {
    res.status(400).json(generateErrorResponse('Please provide \'url\'', 400))
  }

  let url = `https://www.masakapahariini.com/resep/${query.url}`

  try {
    const htmlResponse = await axios.get(url)
    const htmlData = htmlResponse.data
    const $ = cheerio.load(htmlData)

    const title = $('header._section-title > h1').text().trim()
    const shortDescription = $('div.excerpt.text-center.text-md-start').text().trim()
    const imageUrl = $('img.image').attr()?.['src'] ?? ''
    const cookTimes = $('div._recipe-features').find('a').text().trim()
    const cookTime = parseCookTimeToMinute(cookTimes)

    const ingredients: IngredientResponse[] = []

    const recipeContainer = $('div._recipe-ingredients')
    
    recipeContainer
      .children()
      .each((recipeIndex, recipeParent) => {
        if (recipeParent.tagName == 'p') {
          const header = $(recipeParent)
          const ingredient: IngredientResponse = { 
            title: header.text().trim(), 
            ingredients: [] 
          }

          let next = header.next();
          while (next.length && next[0].tagName == 'div') {
            ingredient.ingredients.push(
              { 
                quantity: next.find('div.part.fw-bold.me-3').text().replace(/\s+/g, ' ').trim(), 
                name: next.find('div.item').text().replace(/\s+/g, ' ').trim()
              }
            )
            next = next.next()
          }

          ingredients.push(ingredient)
        }
      }
    )

    const instructions: string[] = []
    const instructionContainer = $('div._recipe-steps')
    instructionContainer
      .children()
      .filter((_, element) => element.tagName == 'div')
      .each((index, element) => {
        const instruction = $(element).find('div.content').text().trim()
        instructions.push(instruction)
      })

    const data: DetailRecipeResponse = {
      image_url: imageUrl,
      title: title,
      cook_time: cookTime,
      ingredients_total: ingredients.flatMap((ingredient) => ingredient.ingredients).length,
      short_description: shortDescription,
      ingredients: ingredients,
      instructions: instructions
    }

    const response = generateResponse(data, 'Success get recipe', 200)
    res.status(200).json(response)
  } catch (e) {
    if (e instanceof AxiosError) {
      res.status(400).json(generateErrorResponse(e.message, 400))
    } else {
      res.status(400).json(generateErrorResponse(String(e), 400))
    }
  }
}

export async function searchRecipes (req: Request<any, any, any, SearchRecipeQuery>, res: Response) {
  const { query } = req

  let url = 'https://www.masakapahariini.com/'
  if (query.query) {
    url += `?s=${query.query}`
  } else {
    url += 'resep'
  }

  try {
    const htmlResponse = await axios.get(url)
    const htmlData = htmlResponse.data as string
    const $ = cheerio.load(htmlData)
    const selectedElements = $('._recipes-list > .row > .col-12 > ._recipe-card > .card')

    const recipeList: RecipeResponse[] = []

    selectedElements.each((parentIndex, parentEl) => {
      const data: RecipeResponse = {
        image_url: '',
        cook_time: 0,
        title: '',
        level: '',
        link: ''
      }

      const imageParentEl = $(parentEl).find('.thumbnail')
      const bodyParentEl = $(parentEl).find('.card-body')

      const imageUrl = $(imageParentEl).find('img').attr()?.['data-src'] ?? ''
      const title = $(bodyParentEl).find('.stretched-link').text().trim()
      const level = $(bodyParentEl).find('div > div > div').find('a').last().text().trim()
      const link = $(bodyParentEl).find('.stretched-link').attr()?.href ?? ''
      const cookTimes = $(bodyParentEl).find('div > div > div').find('a').first().text().trim()
    
      data.image_url = imageUrl
      data.title = title
      data.cook_time = parseCookTimeToMinute(cookTimes)
      data.level = level

      const links = link.split('/')
      links.pop()
      data.link = links.pop() ?? ''

      recipeList.push(data)
    })

    const response = generateResponse(recipeList, 'Success get recipe list', 200)

    res.status(200).json(response)
  } catch (e) {
    if (e instanceof AxiosError) {
      res.status(400).json(generateErrorResponse(e.message, 400))
    } else {
      console.log(e)
      res.status(400).json(generateErrorResponse('Error unknown', 400))
    }
  }
}

export async function getRecipes (req: Request<any, any, any, GetRecipeQuery>, res: Response) {
  const { query } = req

  if (!query.type) {
    return res.status(400).json(generateErrorResponse('Type is required', 400))
  }

  let url = `https://www.masakapahariini.com/resep/${query.type}/`
  if (query.page) {
    url = `https://www.masakapahariini.com/resep/${query.type}/page/${String(query.page)}`
  }

  try {
    const htmlResponse = await axios.get(url)
    const htmlData = htmlResponse.data as string
    const $ = cheerio.load(htmlData)
    const selectedElements = $('._recipes-list > .row > .col-12 > ._recipe-card > .card')

    const recipeList: RecipeResponse[] = []

    selectedElements.each((parentIndex, parentEl) => {
      const data: RecipeResponse = {
        image_url: '',
        cook_time: 0,
        title: '',
        level: '',
        link: ''
      }

      const imageParentEl = $(parentEl).find('.thumbnail')
      const bodyParentEl = $(parentEl).find('.card-body')

      const imageUrl = $(imageParentEl).find('img').attr()?.['data-src'] ?? ''
      const title = $(bodyParentEl).find('a.stretched-link').text().trim()
      const level = $(bodyParentEl).find('div > div > div').find('a').last().text().trim()
      const link = $(bodyParentEl).find('a.stretched-link').attr()?.href ?? ''

      const cookTimes = $(bodyParentEl).find('div > div > div').find('a').first().text().trim()

      data.image_url = imageUrl
      data.title = title
      data.cook_time = parseCookTimeToMinute(cookTimes)
      data.level = level
      
      const links = link.split('/')
      links.pop()
      data.link = links.pop() ?? ''

      recipeList.push(data)
    })

    const response = generateResponse(recipeList, 'Success get recipe list', 200)

    res.status(200).json(response)
  } catch (e) {
    if (e instanceof AxiosError) {
      res.status(400).json(generateErrorResponse(e.message, 400))
    } else {
      console.log(e)
      res.status(400).json(generateErrorResponse('Error unknown', 400))
    }
  }
}
