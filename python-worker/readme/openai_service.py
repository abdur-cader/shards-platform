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
Generate a complete, self-contained, polished README/tutorial **as a single valid TipTap JSON object** for this repository.

Strict Output Contract:
- Output **exactly one valid TipTap JSON object** with this exact structure:
  {{"type": "doc", "content": [array_of_nodes]}}
- **Never** output anything outside this JSON structure - no additional text, comments, or explanations.
- Use **only these valid TipTap node types**: "paragraph", "heading", "bulletList", "listItem", "codeBlock", "text"
- Use **only these valid mark types**: "bold", "italic", "code", "underline"
- **Never** use snake_case variants like "bullet_list" or "list_item" - always use camelCase
- Ensure every node has required attributes (e.g., heading must have "level" and "textAlign")

Repository Context:
- Repo Name: {context['repo_meta'].get('name', 'Unknown')}
- Description: {context['repo_meta'].get('description', '')}
- Primary Language: {context['repo_meta'].get('language', '')}
- Files: {context['files']}
- User Input: {context['user_input']}
- Important Code Snippets: {context.get('code_snippets', 'No code snippets available')}

Content Requirements:
- Minimum 300 words, descriptive yet casual tone
- **Required sections**: Overview, Features, Installation, Usage, Code Explanation
- Include **2-3 actual code examples** with proper language attributes in codeBlock nodes
- Use **emojis** before section header text
- Text should **always** start with a heading
- All text nodes must be properly nested within paragraph or other container nodes
- Every heading node must have: {{"attrs": {{"level": number, "textAlign": "left"}}}}
- Every paragraph node must have: {{"attrs": {{"textAlign": "left"}}}}
- Every codeBlock node must have: {{"attrs": {{"language": "language-name"}}}}

Validation Rules:
1. JSON must be syntactically valid
2. All node types must be valid TipTap types
3. All marks must be valid TipTap marks  
4. No empty content arrays
5. No missing required attributes
6. No text nodes outside of container nodes
7. No markdown or HTML in text content

Output:
**ONLY** the complete TipTap JSON object that passes all validation rules. No other text.
"""


    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a README generator that outputs only TipTap JSON. Output exactly one JSON object with type: 'doc' and content array."},
                {"role": "user", "content": prompt},
            ],
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