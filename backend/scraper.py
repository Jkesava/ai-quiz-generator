import requests
from bs4 import BeautifulSoup
import re

def scrape_wikipedia(url: str) -> tuple[str, str]:
    """
    Scrapes a Wikipedia article and returns clean text content and title.
    
    Args:
        url: Wikipedia article URL
        
    Returns:
        tuple: (clean_text, article_title)
    """
    try:
        # Validate Wikipedia URL
        if "wikipedia.org" not in url:
            raise ValueError("URL must be a Wikipedia article")
        
        # Fetch the page
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        # Parse HTML
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Extract title
        title = soup.find('h1', {'id': 'firstHeading'})
        article_title = title.get_text() if title else "Unknown Article"
        
        # Find main content
        content_div = soup.find('div', {'id': 'mw-content-text'})
        if not content_div:
            raise ValueError("Could not find article content")
        
        # Remove unwanted elements
        for element in content_div.find_all(['sup', 'table', 'style', 'script']):
            element.decompose()
        
        # Remove references and navigation
        for element in content_div.find_all('div', {'class': ['reflist', 'navbox', 'infobox']}):
            element.decompose()
        
        # Extract paragraphs from the main content area
        paragraphs = content_div.find_all('p')
        
        # Clean and join text
        clean_text = []
        for p in paragraphs:
            text = p.get_text()
            # Remove citation markers like [1], [2], etc.
            text = re.sub(r'\[\d+\]', '', text)
            # Remove extra whitespace
            text = ' '.join(text.split())
            if len(text) > 50:  # Only keep substantial paragraphs
                clean_text.append(text)
        
        # Join paragraphs with double newline
        article_text = '\n\n'.join(clean_text)
        
        # Limit to first 10000 characters to avoid token limits
        if len(article_text) > 10000:
            article_text = article_text[:10000] + "..."
        
        if not article_text.strip():
            raise ValueError("No content could be extracted from the article")
        
        return article_text, article_title
        
    except requests.RequestException as e:
        raise Exception(f"Failed to fetch Wikipedia article: {str(e)}")
    except Exception as e:
        raise Exception(f"Error scraping article: {str(e)}")
