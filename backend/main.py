from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os

def load_env():
    env_path = os.path.join(os.path.dirname(__file__), ".env")
    if os.path.exists(env_path):
        with open(env_path, "r") as f:
            for line in f:
                if line.strip() and not line.startswith("#"):
                    parts = line.strip().split("=", 1)
                    if len(parts) == 2:
                        key, val = parts
                        os.environ[key.strip()] = val.strip().strip('"').strip("'")

def safe_print(msg: str):
    try:
        print(msg)
    except UnicodeEncodeError:
        try:
            print(msg.encode('ascii', errors='replace').decode('ascii'))
        except Exception:
            pass

app = FastAPI()

# Allow CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the exact domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from typing import List, Optional

class ChatMessage(BaseModel):
    sender: str
    text: str

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = None

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Backend AI is running!"}

@app.post("/api/chat")
def chat_endpoint(req: ChatRequest):
    import urllib.request
    import json
    
    load_env()
    
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key or "YOUR_GEMINI_API_KEY_HERE" in api_key or api_key.strip() == "":
        user_msg = req.message.lower()
        response_msg = "I am Navya's AI clone. (Please set your GEMINI_API_KEY in the backend `.env` file to activate conversational AI!)"
        if "resume" in user_msg or "experience" in user_msg or "background" in user_msg:
            response_msg = "Navya is a passionate Full-Stack and ML developer who enjoys building systems at the intersection of AI and web applications."
        elif "project" in user_msg or "portfolio" in user_msg:
            response_msg = "Her notable projects include this 3D portfolio, a dynamic cache analysis platform, and various ML predictors."
        elif "hello" in user_msg or "hi" in user_msg:
            response_msg = "Hello! Welcome to Navya's 3D portfolio. How can I assist you today?"
        return {"response": response_msg}
        
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
    
    system_prompt = """You are an AI clone of Navya Khandelwal.
You are a passionate Full-Stack and ML Developer.

About Navya:
- Education: Bachelor of Technology in Computer Science & Engineering, focusing on software development, data structures, algorithms, and AI integration.
- Focus: Building systems at the intersection of AI/ML and modern web applications.
- Skills: Python, React, TypeScript, Git, RAG (Retrieval-Augmented Generation), CSS, SQL, Java.
- Profiles: LeetCode (username: `Navya_Ninja`) and HackerRank (username: `navya18_kh`).

Actual Projects Built by Navya:
1. **Mini-Lead-Distribution**: A TypeScript project focused on automated and efficient lead distribution algorithms.
2. **Blood-Transfusion-prediction**: A machine learning project using Jupyter Notebooks to predict blood transfusion likelihoods based on clinical data.
3. **3D Interactive Portfolio**: This very website, built using React, Three.js (React Three Fiber/Drei), Vite, and FastAPI.

Certifications & Achievements:
- **Java Foundation Certification** from Infosys Springboard (Mar 2026).
- **GenAI Powered Data Analytics Certification** from TATA via Forage (Jul 2025), covering Exploratory Data Analysis, Predictive Delinquency with AI, and Data Storytelling.
- **Python (Basic)** Skill Certification from HackerRank.
- **Google Cloud Innovators Plus** community badge from Google Developers (May 2026).

Guidelines:
- When asked about Navya's background, education, certifications, or projects, respond strictly using these actual facts. Do not make up any other projects.
- If asked general technical/coding questions, answer them helpfuly and friendly as a smart developer clone.
- Keep responses engaging and concise (under 3-4 sentences)."""

    contents = []
    if req.history:
        for msg in req.history:
            role = "user" if msg.sender == "user" else "model"
            contents.append({
                "role": role,
                "parts": [{"text": msg.text}]
            })
            
    already_appended = False
    if contents and contents[-1]["role"] == "user" and contents[-1]["parts"][0]["text"] == req.message:
        already_appended = True
        
    if not already_appended:
        contents.append({
            "role": "user",
            "parts": [{"text": req.message}]
        })

    body = {
        "contents": contents,
        "systemInstruction": {
            "parts": [
                {
                    "text": system_prompt
                }
            ]
        },
        "generationConfig": {
            "maxOutputTokens": 800,
            "temperature": 0.7,
            "thinkingConfig": {
                "thinkingBudget": 0
            }
        }
    }
    
    headers = {
        "Content-Type": "application/json"
    }
    
    req_obj = urllib.request.Request(
        url, 
        data=json.dumps(body).encode("utf-8"), 
        headers=headers, 
        method="POST"
    )
    
    try:
        import urllib.error
        safe_print(f"[CHAT] Request: {req.message}")
        with urllib.request.urlopen(req_obj, timeout=12) as response:
            res_body = response.read().decode("utf-8")
            safe_print(f"[CHAT] Raw Gemini response: {res_body}")
            res_data = json.loads(res_body)
            candidates = res_data.get("candidates", [])
            if candidates:
                output_text = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                safe_print(f"[CHAT] Output response: {output_text}")
                return {"response": output_text.strip()}
            return {"response": "Sorry, I couldn't generate a response. Please try again."}
    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8")
        safe_print(f"[CHAT] HTTP Error {e.code}: {err_body}")
        return {"response": f"AI Error: Could not connect to Gemini. (HTTP Error {e.code}: {e.reason})"}
    except Exception as e:
        safe_print(f"[CHAT] General Error: {str(e)}")
        return {"response": f"AI Error: Could not connect to Gemini. ({str(e)})"}

@app.get("/api/leetcode/{username}")
def get_leetcode_profile(username: str):
    import urllib.request
    import json
    
    url = "https://leetcode.com/graphql"
    query = """
    query userProblemsSolved($username: String!) {
      allQuestionsCount {
        difficulty
        count
      }
      matchedUser(username: $username) {
        submitStats {
          acSubmissionNum {
            difficulty
            count
          }
        }
        profile {
          ranking
          reputation
        }
      }
    }
    """
    
    headers = {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }
    
    body = {
        "query": query,
        "variables": {"username": username}
    }
    
    req = urllib.request.Request(url, data=json.dumps(body).encode("utf-8"), headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            res_data = json.loads(response.read().decode("utf-8"))
            if not res_data.get("data") or not res_data["data"].get("matchedUser"):
                return {"status": "error", "message": "User not found"}
            
            data = res_data["data"]
            all_questions = {item["difficulty"]: item["count"] for item in data.get("allQuestionsCount", [])}
            matched_user = data.get("matchedUser") or {}
            submit_stats = matched_user.get("submitStats") or {}
            ac_submissions = submit_stats.get("acSubmissionNum") or []
            
            solved = {item["difficulty"]: item["count"] for item in ac_submissions}
            profile = matched_user.get("profile") or {}
            
            return {
                "status": "success",
                "username": username,
                "ranking": profile.get("ranking"),
                "solved": {
                    "all": solved.get("All", 0),
                    "easy": solved.get("Easy", 0),
                    "medium": solved.get("Medium", 0),
                    "hard": solved.get("Hard", 0)
                },
                "total": {
                    "all": all_questions.get("All", 3200),
                    "easy": all_questions.get("Easy", 800),
                    "medium": all_questions.get("Medium", 1600),
                    "hard": all_questions.get("Hard", 800)
                }
            }
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/api/hackerrank/{username}")
def get_hackerrank_profile(username: str):
    import urllib.request
    import json
    
    url = f"https://www.hackerrank.com/rest/hackers/{username}/badges"
    headers = {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json"
    }
    
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            res_data = json.loads(response.read().decode("utf-8"))
            if not res_data.get("status"):
                return {"status": "error", "message": "Failed to retrieve HackerRank data"}
            
            badges = []
            for model in res_data.get("models", []):
                # Filter out badges with 0 stars if you want, or include them all
                badges.append({
                    "name": model.get("badge_name"),
                    "stars": model.get("stars", 0),
                    "solved": model.get("solved", 0),
                    "total": model.get("total_challenges", 0),
                    "rank": model.get("hacker_rank")
                })
                
            return {
                "status": "success",
                "username": username,
                "badges": badges
            }
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/api/github/{username}")
def get_github_profile(username: str):
    import urllib.request
    import json
    
    user_url = f"https://api.github.com/users/{username}"
    repos_url = f"https://api.github.com/users/{username}/repos?sort=updated&per_page=5"
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/vnd.github.v3+json"
    }
    
    try:
        # Fetch user profile
        user_req = urllib.request.Request(user_url, headers=headers)
        with urllib.request.urlopen(user_req, timeout=10) as user_res:
            user_data = json.loads(user_res.read().decode("utf-8"))
            
        # Fetch repositories
        repos_req = urllib.request.Request(repos_url, headers=headers)
        with urllib.request.urlopen(repos_req, timeout=10) as repos_res:
            repos_data = json.loads(repos_res.read().decode("utf-8"))
            
        repos = []
        for repo in repos_data:
            repos.append({
                "name": repo.get("name"),
                "description": repo.get("description"),
                "url": repo.get("html_url"),
                "language": repo.get("language"),
                "stars": repo.get("stargazers_count")
            })
            
        return {
            "status": "success",
            "username": username,
            "avatar": user_data.get("avatar_url"),
            "public_repos": user_data.get("public_repos"),
            "followers": user_data.get("followers"),
            "following": user_data.get("following"),
            "repos": repos
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}
