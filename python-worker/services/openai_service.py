import os
from openai import OpenAI
import json

client = OpenAI(api_key="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")

import json

async def generate_readme_from_context(context: dict):
    # fake tiptap json output
    tiptap_json = {
        "type": "doc",
        "content": [
            {
                "type": "heading",
                "attrs": { "level": 1 },
                "content": [{ "type": "text", "text": "Project: shards" }]
            },
            {
                "type": "paragraph",
                "content": [
                    { "type": "text", "text": "A Next.js + Supabase project where users submit their GitHub repositories and receive AI-powered feedback." }
                ]
            },
            {
                "type": "heading",
                "attrs": { "level": 2 },
                "content": [{ "type": "text", "text": "Getting Started" }]
            },
            {
                "type": "codeBlock",
                "attrs": { "language": "bash" },
                "content": [
                    { "type": "text", "text": "git clone https://github.com/user/shards\ncd shards\nnpm install\nnpm run dev" }
                ]
            }
        ]
    }

    # wrap inside { "content": ... } so Next.js can do const { content } = ...
    return { "content": tiptap_json }



# async def generate_readme_from_context(context: dict):
#     prompt = f"""
#     Generate a comprehensive README in TipTap JSON format based on:
#     - Repo: {context['repo_meta'].get('name', 'Unknown')}
#     - Description: {context['repo_meta'].get('description', 'No description')}
#     - Language: {context['repo_meta'].get('language', 'Unknown')}
#     - Files: {context['files']}
#     - User Input: {context['user_input']}
    
#     Output valid TipTap JSON only.
#     """

#     response = client.chat.completions.create(
#         model="gpt-4o-mini",
#         messages=[
#             {"role": "system", "content": "You are a README generator that outputs only TipTap JSON."},
#             {"role": "user", "content": prompt},
#         ],
#         temperature=0.7
#     )

#     return response.choices[0].message.content