# openai_service.py
import os
from openai import OpenAI
import json
from dotenv import load_dotenv

load_dotenv()


api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)

import json

async def generate_readme_from_context(context: dict):
    print("GENERATE FUNCTION CALLED!!!!!!!!!!!!!")
    print("API KEY: ", client)

    # PROMPT TO BE CHANGED TO PC ONE
    prompt = f"""
You are an expert technical writer and TipTap (ProseMirror) content generator.

Objective:
Create a self-contained, polished README/tutorial **as TipTap JSON** for this single repository (treat it as a standalone project with full context, not a part 2 of anything else).

Strict Output Contract (do not violate):
- Output **one** JSON object only, starting with:
  {{
    "type": "doc",
    "content": [...]
  }}
- **Never** output a top-level array. If you would output an array, **wrap it under** the single `doc` node.
- Use only these TipTap nodes:
  - `doc`
  - `heading` (with `attrs.level` 1–3, and `attrs.textAlign` for left, center, right)
  - `paragraph` (with `attrs.textAlign` for left, center, right)
  - `bulletList`, `listItem`
  - `orderedList`, `listItem`
  - `codeBlock` (with `attrs.language`)
  - `hardBreak`
  - **Tables**: `table`, `tableRow`, `tableHeader`, `tableCell`

- Use only these TipTap marks:
  - `bold`
  - `italic`
  - `underline`
  - `code`

  (** Use inline code only for short code lines or variables. For commands or actual code lines, for example `git clone`, use code blocks. **)

**MOST IMPORTANT EXAMPLE (Emulate this style):**
```json
{{
  "type": "paragraph",
  "content": [
    {{ "type": "text", "text": "The core function is " }},
    {{ "type": "text", "marks": [{{"type": "bold"}}], "text": "generate_custom" }},
    {{ "type": "text", "text": " located in " }},
    {{ "type": "text", "marks": [{{"type": "code"}}], "text": "generate_image.py" }},
    {{ "type": "text", "text": ". It handles the entire pipeline, from loading an image with " }},
    {{ "type": "text", "marks": [{{"type": "code"}}], "text": "PIL.Image.open()" }},
    {{ "type": "text", "text": " to generating a caption using a specified model like " }},
    {{ "type": "text", "marks": [{{"type": "bold"}}], "text": "BLIP" }},
    {{ "type": "text", "text": " or " }},
    {{ "type": "text", "marks": [{{"type": "bold"}}], "text": "GPT-2" }},
    {{ "type": "text", "text": "." }}
  ]
}}```
Now, generate the complete, long-form, and well-formatted TipTap JSON README for the ai-image-captioner project. I will only accept output that uses marks for formatting and meets all quality and content requirements above.

- Allowed marks: `highlight` only (use for the opening notice).

- Do NOT use markdown formatting (like `**bold**`, `_italic_`, or backticks), as TipTap doesn't support Markdown.
  Instead, represent formatting with official TipTap JSON `marks` objects.

- JSON must be valid; no commentary or text outside the JSON.


Quality Bar:
- **Minimum 230 words** (clear, readable, and instructive).
- Must stand on its own: explain context, what the project is, why it exists, how to use it, and how pieces fit together.
- Include sections (H1–H3) for: Overview, Features, Installation, Usage, Code Explanation, and a small Tech/Metadata table.
- For each code example: add a short paragraph **before** the snippet explaining what it does and when to use it.
- Use natural, human flow with line breaks where helpful (`hardBreak`) and bullet lists for scannability.

Code Blocks:
- Use TipTap codeBlock nodes compatible with Lowlight, e.g.:
  {{
    "type": "codeBlock",
    "attrs": {{ "language": "python" }},
    "content": [{{ "type": "text", "text": "print('hello world')" }}]
  }}
- Prefer languages that match the repo; if unknown, infer from filenames or defaults.

Opening Requirement:
- The first node must be a `paragraph` whose first text node is marked with `highlight` and says exactly: **test successful**.

Repository Context (use this to tailor the README; integrate details, filenames, and code snippets):
- Repo Name: {context['repo_meta'].get('name', 'Unknown')}
- Description: {context['repo_meta'].get('description', '')}
- Primary Language: {context['repo_meta'].get('language', '')}
- Files: {context['files']}
- User Input: {context['user_input']}
- Important Code Snippets: {context.get('code_snippets', 'No code snippets available')}

Content Guidance (adapt to the actual repo):
- Overview (what it does, problem it solves, who it’s for).
- Features (bullet list).
- Installation (at least one concrete install flow).
- Usage (at least one runnable example and expected output).
- Code Explanation (walk through key functions/classes; reference included files).
- Table (small matrix like “Component | Role | File”; use `table`/`tableRow`/`tableHeader`/`tableCell`).
- Notes/Tips (edge cases, environment variables, common pitfalls).

# In the prompt, add specific instructions:

CODE INTEGRATION REQUIREMENTS:
- Include at least 2-3 actual code examples from the snippets provided above
- For each code example, add a brief explanation of what it does
- Use the exact file names and code content from the snippets
- Include clone instructions: git clone {context.get('clone_url')}
- Reference specific files that exist in the repository: {', '.join(context['files'][:10])}


Remember:
- **Single TipTap JSON object only**, `"type": "doc"` at the top.
- **>= 300 words - make it descriptive (try to make it long but readable) and have a casual tone (with proper capitalization)**.
- Use multiple text formatting wherever possible (bold, italics, code, codeblocks). Remember to use proper TipTap json syntaxing for formatting.
- Use emojis before bullet points (i.e: "🚀 Getting Started")
- The total text inside paragraphs must be at least 230 words. Do not cut short.
- No extra commentary outside JSON.
- Do not include explanations of trivial or self-evident steps. Exclude obvious or redundant information that adds no value.
"""




    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a README generator that outputs only TipTap JSON."},
            {"role": "user", "content": prompt},
        ],
        temperature=0.7,
        response_format={"type":"json_object"}
    )
    print("RESPONSE STORED!!!!!!!!!!!!!!!!!!")

    # be defensive
    raw = response.choices[0].message.content
    if not raw:
        raise ValueError("Empty response from OpenAI")

    try:
        data = json.loads(raw)
    except json.JSONDecodeError as e:
        print("JSON parsing failed, raw output:\n", raw)
        raise e

    return data



# TODO: Feeding repo information with metadata and files with heuristics
"""
Extra Description
Topics
Key Files and Snippets
User notes
"""