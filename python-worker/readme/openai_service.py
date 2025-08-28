# openai_service.py
import os
from openai import OpenAI
import json
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)

async def generate_readme_from_context(context: dict):
    print("GENERATE FUNCTION CALLED")
    print("API KEY available:", bool(api_key))

    prompt = f"""
You are an expert technical writer and TipTap (ProseMirror) content generator.

Objective:
Create a self-contained, polished README/tutorial **as TipTap JSON** for this single repository.

Strict Output Contract:
- Output **one** JSON object only with the exact structure:
  {{
    "type": "doc",
    "content": [...]
  }}
- **Never** output a top-level array or nested structure
- Use only standard TipTap nodes and marks as specified

Repository Context:
- Repo Name: {context['repo_meta'].get('name', 'Unknown')}
- Description: {context['repo_meta'].get('description', '')}
- Primary Language: {context['repo_meta'].get('language', '')}
- Files: {context['files']}
- User Input: {context['user_input']}
- Important Code Snippets: {context.get('code_snippets', 'No code snippets available')}

Requirements:
- Minimum 300 words, descriptive and casual tone
- Include: Overview, Features, Installation, Usage, Code Explanation
- Use multiple text formatting (bold, italics, code, codeblocks)
- Include at least 2-3 actual code examples with explanations
- Use emojis before section headers
- First paragraph must contain "test successful" with highlight mark

Output ONLY the TipTap JSON object, no additional text or commentary.
"""

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a README generator that outputs only TipTap JSON. Output exactly one JSON object with type: 'doc' and content array."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.7,
            response_format={"type": "json_object"}
        )
        print("OpenAI response received")

        raw = response.choices[0].message.content
        if not raw:
            raise ValueError("Empty response from OpenAI")

        data = json.loads(raw)
        
        # Ensure the response has the correct structure
        if not isinstance(data, dict) or data.get("type") != "doc" or "content" not in data:
            raise ValueError("Invalid TipTap JSON structure returned by OpenAI")
        
        if response.usage:
            print("USED CREDITS:::::::::::::::::::::::::::::::::::::::::::::::::: ",response.usage.total_tokens)
        
        # Return direct structure without nesting
        return {
            "readme": data,  # Direct TipTap JSON
            "used_credits": response.usage.total_tokens if response.usage else 0
        }

    except json.JSONDecodeError as e:
        print("JSON parsing failed, raw output:\n", raw)
        raise ValueError(f"JSON parsing error: {str(e)}")
    except Exception as e:
        print(f"OpenAI API error: {str(e)}")
        raise