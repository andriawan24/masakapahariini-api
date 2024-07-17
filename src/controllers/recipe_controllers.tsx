import axios, { AxiosError } from 'axios'
import * as cheerio from 'cheerio'
import type { Request, Response } from 'express'
import type { RecipeResponse } from '../models/response/recipe_response'
import type { GetRecipeQuery, SearchRecipeQuery } from '../models/request/recipe_request'
import { generateErrorResponse, generateResponse } from '../utils/response_utils'

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
        level: ''
      }

      const imageParentEl = $(parentEl).find('.thumbnail')
      const bodyParentEl = $(parentEl).find('.card-body')

      const imageUrl = $(imageParentEl).find('img').attr()?.['data-src'] ?? ''
      const title = $(bodyParentEl).find('.stretched-link').text().trim()
      let cookTime = 0
      const level = $(bodyParentEl).find('div > div > div').find('a').last().text().trim()

      const cookTimeSplit = $(bodyParentEl).find('div > div > div').find('a').first().text().trim().split(' ')
      if (cookTimeSplit.length > 1) {
        const hour = Number(cookTimeSplit[0].replace('jam', '')) * 60
        const minute = Number(cookTimeSplit[1].replace('mnt', ''))
        cookTime = hour + minute
      } else {
        if (cookTimeSplit[0].endsWith('jam')) {
          cookTime = Number(cookTimeSplit[0].replace('jam', '')) * 60
        } else {
          cookTime = Number(cookTimeSplit[0].replace('mnt', '')) * 60
        }
      }

      data.image_url = imageUrl
      data.title = title
      data.cook_time = cookTime
      data.level = level

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
        level: ''
      }

      const imageParentEl = $(parentEl).find('.thumbnail')
      const bodyParentEl = $(parentEl).find('.card-body')

      const imageUrl = $(imageParentEl).find('img').attr()?.['data-src'] ?? ''
      const title = $(bodyParentEl).find('.stretched-link').text().trim()
      let cookTime = 0
      const level = $(bodyParentEl).find('div > div > div').find('a').last().text().trim()

      const cookTimeSplit = $(bodyParentEl).find('div > div > div').find('a').first().text().trim().split(' ')
      if (cookTimeSplit.length > 1) {
        const hour = Number(cookTimeSplit[0].replace('jam', '')) * 60
        const minute = Number(cookTimeSplit[1].replace('mnt', ''))
        cookTime = hour + minute
      } else {
        if (cookTimeSplit[0].endsWith('jam')) {
          cookTime = Number(cookTimeSplit[0].replace('jam', '')) * 60
        } else {
          cookTime = Number(cookTimeSplit[0].replace('mnt', '')) * 60
        }
      }

      data.image_url = imageUrl
      data.title = title
      data.cook_time = cookTime
      data.level = level

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
