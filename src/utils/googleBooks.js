const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY
const BASE_URL = 'https://www.googleapis.com/books/v1/volumes'

export const searchBooks = async (query) => {
  try {
    const response = await fetch(`${BASE_URL}?q=${encodeURIComponent(query)}&key=${API_KEY}`)
    const data = await response.json()
    
    if (!data.items) {
      return []
    }

    return data.items.map(item => ({
      id: item.id,
      title: item.volumeInfo.title,
      authors: item.volumeInfo.authors || ['Unknown Author'],
      description: item.volumeInfo.description || 'No description available',
      thumbnail: item.volumeInfo.imageLinks?.thumbnail || null,
      publishedDate: item.volumeInfo.publishedDate,
      categories: item.volumeInfo.categories || [],
      averageRating: item.volumeInfo.averageRating,
      ratingsCount: item.volumeInfo.ratingsCount
    }))
  } catch (error) {
    console.error('Error searching books:', error)
    return []
  }
}

export const getRecommendationsByInterests = async (interests) => {
  try {
    // Create a more flexible query that searches for books related to the interests
    const query = interests.map(interest => `"${interest}"`).join(' OR ')
    const response = await fetch(`${BASE_URL}?q=${encodeURIComponent(query)}&orderBy=relevance&maxResults=20&key=${API_KEY}`)
    const data = await response.json()
    
    if (!data.items) {
      return []
    }

    // Filter and sort by rating if available
    return data.items
      .map(item => ({
        id: item.id,
        title: item.volumeInfo.title,
        authors: item.volumeInfo.authors || ['Unknown Author'],
        description: item.volumeInfo.description || 'No description available',
        thumbnail: item.volumeInfo.imageLinks?.thumbnail || null,
        publishedDate: item.volumeInfo.publishedDate,
        categories: item.volumeInfo.categories || [],
        averageRating: item.volumeInfo.averageRating || 0,
        ratingsCount: item.volumeInfo.ratingsCount || 0
      }))
      .filter(book => {
        // Filter books that match at least one of the interests
        const bookCategories = book.categories.map(cat => cat.toLowerCase())
        return interests.some(interest => 
          bookCategories.some(cat => cat.includes(interest.toLowerCase()))
        )
      })
      .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
      .slice(0, 5) // Return top 5 recommendations
  } catch (error) {
    console.error('Error getting recommendations:', error)
    return []
  }
}

export const getRecommendationsByBooks = async (books) => {
  try {
    // Create a query that searches for similar books based on categories of read books
    const categories = books.flatMap(book => book.categories || [])
    const uniqueCategories = [...new Set(categories)]
    const query = `subject:${uniqueCategories.join(' OR subject:')}`
    
    const response = await fetch(`${BASE_URL}?q=${encodeURIComponent(query)}&orderBy=relevance&maxResults=10&key=${API_KEY}`)
    const data = await response.json()
    
    if (!data.items) {
      return []
    }

    // Filter out books that the user has already read
    const readBookIds = books.map(book => book.id)
    
    return data.items
      .filter(item => !readBookIds.includes(item.id))
      .map(item => ({
        id: item.id,
        title: item.volumeInfo.title,
        authors: item.volumeInfo.authors || ['Unknown Author'],
        description: item.volumeInfo.description || 'No description available',
        thumbnail: item.volumeInfo.imageLinks?.thumbnail || null,
        publishedDate: item.volumeInfo.publishedDate,
        categories: item.volumeInfo.categories || [],
        averageRating: item.volumeInfo.averageRating || 0,
        ratingsCount: item.volumeInfo.ratingsCount || 0
      }))
      .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
      .slice(0, 5) // Return top 5 recommendations
  } catch (error) {
    console.error('Error getting recommendations:', error)
    return []
  }
} 