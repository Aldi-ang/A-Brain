---
title: "n8n Workflow Templates — Full Index"
description: Every workflow in the archived awesome-n8n-templates repo, with its node count and main integrations. Read this only when Aldi asks about automation; it is large.
type: reference
created: 2026-08-23
updated: 2026-08-23
confidence: high
checked: 2026-08-23
tags: [reference, automation, n8n, archive]
---

# n8n Workflow Templates — Full Index

Generated from the local archive at `Archive/awesome-n8n-templates/`, not from the web. **339 of
347 workflow files indexed**; the other 8 are malformed JSON in the upstream repo and are listed at
the bottom — their raw files are saved regardless.

"Main integrations" lists the real service nodes in each workflow, with plumbing nodes (set, if,
merge, code, switch, wait, filter, sticky notes) stripped out so the table shows what a workflow
actually *touches*.

### (root)  ·  1 workflows

| Workflow | Nodes | Main integrations |
|---|---|---|
| AI product imagines | 17 | manualTrigger, googleDrive, LC:openAi, LC:lmChatOpenAi, LC:agent, LC:outputParserStructured |

### AI Research RAG and Data Analysis  ·  40 workflows

| Workflow | Nodes | Main integrations |
|---|---|---|
| Analyze tradingview.com charts with Chrome extension, N8N and OpenAI | 5 | webhook, LC:openAi, respondToWebhook |
| Automated Hugging Face Paper Summary Fetching & Categorization Workflow | 17 | httpRequest, executeWorkflowTrigger |
| Autonomous AI crawler | 38 | LC:toolWorkflow, LC:lmChatOpenAi, LC:outputParserStructured, manualTrigger, supabase, markdown |
| Bilig WorkPaper MCP formula engine for n8n agents | 4 | manualTrigger, httpRequest |
| Build a Financial Documents Assistant using Qdrant and Mistral.ai | 29 | localFileTrigger, manualTrigger, readWriteFile, LC:embeddingsMistralCloud, LC:documentDefaultDataLoader, LC:textSplitterRecursiveCharacterTextSplitter |
| Build a Tax Code Assistant with Qdrant, Mistral.ai and OpenAI | 38 | manualTrigger, LC:embeddingsMistralCloud, LC:documentDefaultDataLoader, LC:textSplitterRecursiveCharacterTextSplitter, httpRequest, compression |
| Build Your Own Image Search Using AI Object Detection, CDN and ElasticSearch | 17 | manualTrigger, httpRequest, splitOut, editImage, elasticsearch |
| Building RAG Chatbot for Movie Recommendations with Qdrant and Open AI | 27 | manualTrigger, github, extractFromFile, LC:embeddingsOpenAi, LC:documentDefaultDataLoader, LC:textSplitterTokenSplitter |
| Chat with GitHub API Documentation_ RAG-Powered Chatbot with Pinecone & OpenAI | 17 | manualTrigger, httpRequest, LC:vectorStorePinecone, LC:documentDefaultDataLoader, LC:textSplitterRecursiveCharacterTextSplitter, LC:chatTrigger |
| Create a Google Analytics Data Report with AI and sent it to E-Mail and Telegram | 14 | scheduleTrigger, googleAnalytics, emailSend, telegram, LC:openAi, LC:toolCalculator |
| Customer Insights with Qdrant, Python and Information Extractor | 37 | manualTrigger, html, splitOut, LC:documentDefaultDataLoader, LC:textSplitterRecursiveCharacterTextSplitter, LC:embeddingsOpenAi |
| DataForge Lite - AI URL Data Extractor | 7 | webhook, httpRequest, openAi, respondToWebhook |
| Deduplicate Scraping AI Grants for Eligibility using AI | 24 | splitOut, httpRequest, LC:lmChatOpenAi, LC:informationExtractor, airtable, removeDuplicates |
| Enrich Property Inventory Survey with Image Recognition and AI Agent | 29 | manualTrigger, LC:lmChatOpenAi, airtable, executeWorkflowTrigger, httpRequest, LC:toolWorkflow |
| Extract insights & analyse YouTube comments via AI Agent chat | 29 | LC:lmChatOpenAi, LC:toolWorkflow, LC:memoryPostgresChat, LC:agent, LC:chatTrigger, httpRequest |
| Generate SEO Seed Keywords Using AI | 15 | LC:lmChatAnthropic, splitOut, aggregate, LC:agent, manualTrigger |
| Hacker News Job Listing Scraper and Parser | 20 | manualTrigger, splitOut, LC:lmChatOpenAi, LC:outputParserStructured, httpRequest, LC:chainLlm |
| Hacker News to Video Content | 48 | manualTrigger, hackerNews, LC:lmChatOpenAi, LC:toolHttpRequest, LC:outputParserStructured, s3 |
| Intelligent Web Query and Semantic Re-Ranking Flow using Brave and Google Gemini | 20 | dateTime, webhook, LC:outputParserAutofixing, LC:outputParserStructured, respondToWebhook, LC:chainLlm |
| Learn Anything from HN - Get Top Resource Recommendations from Hacker News | 10 | LC:lmChatGoogleGemini, LC:chainLlm, hackerNews, httpRequest, aggregate, splitOut |
| Live Web Research Agent with Superhighway | 7 | manualTrigger, httpRequest |
| Make OpenAI Citation for File Retrieval RAG | 19 | aggregate, LC:memoryBufferWindow, LC:chatTrigger, LC:openAi, httpRequest, splitOut |
| Open Deep Research - AI-Powered Autonomous Research Workflow | 17 | LC:chatTrigger, LC:chainLlm, LC:lmChatOpenRouter, httpRequest, LC:agent, LC:memoryBufferWindow |
| Query Perplexity AI from your n8n workflows | 6 | manualTrigger, httpRequest |
| Reconcile Rent Payments with Local Excel Spreadsheet and OpenAI | 17 | localFileTrigger, LC:toolCode, LC:outputParserStructured, readWriteFile, extractFromFile, splitOut |
| Scrape and summarize posts of a news site without RSS feed using AI and save them to a NocoDB | 36 | html, openAi, httpRequest, scheduleTrigger, nocoDb |
| Scrape and summarize webpages with AI | 15 | manualTrigger, httpRequest, html, splitOut, limit, LC:documentDefaultDataLoader |
| Scrape Trustpilot Reviews with DeepSeek, Analyze Sentiment with OpenAI | 20 | splitOut, LC:informationExtractor, manualTrigger, limit, httpRequest, html |
| Send Google analytics data to A.I. to analyze then save results in Baserow | 22 | scheduleTrigger, manualTrigger, googleAnalytics, httpRequest, baserow |
| SocialPulse Lite - Reddit Trend Monitor | 7 | scheduleTrigger, httpRequest, openAi, googleSheets |
| Spot Workplace Discrimination Patterns with AI | 38 | manualTrigger, LC:lmChatOpenAi, httpRequest, html, LC:informationExtractor, quickChart |
| Summarize SERPBear data with AI (via Openrouter) and save it to Baserow | 10 | manualTrigger, scheduleTrigger, httpRequest, baserow |
| Summarize Umami data with AI (via Openrouter) and save it to Baserow | 17 | manualTrigger, scheduleTrigger, httpRequest, baserow |
| Survey Insights with Qdrant, Python and Information Extractor | 42 | LC:embeddingsOpenAi, LC:documentDefaultDataLoader, LC:textSplitterRecursiveCharacterTextSplitter, googleSheets, splitOut, httpRequest |
| Ultimate Scraper Workflow for n8n | 63 | html, LC:lmChatOpenAi, httpRequest, limit, respondToWebhook, LC:informationExtractor |
| Vector Database as a Big Data Analysis Tool for AI Agents [1_3 anomaly][1_2 KNN] | 25 | manualTrigger, googleCloudStorage, httpRequest |
| Vector Database as a Big Data Analysis Tool for AI Agents [2_2 KNN] | 18 | httpRequest, executeWorkflowTrigger |
| Vector Database as a Big Data Analysis Tool for AI Agents [2_3 - anomaly] | 48 | manualTrigger, httpRequest, splitOut |
| Vector Database as a Big Data Analysis Tool for AI Agents [3_3 - anomaly] | 17 | httpRequest, executeWorkflowTrigger |
| Visual Regression Testing with Apify and AI Vision Model | 34 | googleDrive, LC:lmChatGoogleGemini, LC:outputParserStructured, httpRequest, googleSheets, scheduleTrigger |

### Airtable  ·  5 workflows

| Workflow | Nodes | Main integrations |
|---|---|---|
| AI Agent for project management and meetings with Airtable and Fireflies | 18 | LC:agent, LC:lmChatOpenAi, LC:toolWorkflow, gmailTool, executeWorkflowTrigger, splitOut |
| AI Agent to chat with Airtable and analyze data | 41 | LC:lmChatOpenAi, LC:agent, LC:memoryBufferWindow, LC:chatTrigger, executeWorkflowTrigger, aggregate |
| Get Airtable data via AI and Obsidian Notes | 7 | airtableTool, LC:lmChatOpenAi, LC:agent, respondToWebhook, webhook |
| Handling Job Application Submissions with AI and n8n Forms | 23 | extractFromFile, LC:lmChatOpenAi, LC:outputParserStructured, formTrigger, airtable, LC:textClassifier |
| vAssistant for Hubspot Chat using OpenAi and Airtable | 34 | httpRequest, airtable, LC:openAi, webhook |

### Database and Storage  ·  5 workflows

| Workflow | Nodes | Main integrations |
|---|---|---|
| Chat with Postgresql Database | 11 | LC:chatTrigger, LC:agent, LC:lmChatOpenAi, postgresTool, LC:memoryBufferWindow |
| Generate SQL queries from schema only - AI-powered | 29 | LC:lmChatOpenAi, LC:memoryBufferWindow, mySql, convertToFile, readWriteFile, extractFromFile |
| MongoDB AI Agent - Intelligent Movie Recommendations | 8 | LC:lmChatOpenAi, mongoDbTool, LC:memoryBufferWindow, LC:chatTrigger, LC:toolWorkflow, LC:agent |
| Supabase Insertion & Upsertion & Retrieval | 21 | googleDrive, LC:documentDefaultDataLoader, LC:chainRetrievalQa, LC:lmChatOpenAi, LC:retrieverVectorStore, LC:textSplitterRecursiveCharacterTextSplitter |
| Talk to your SQLite database with a LangChain AI Agent | 13 | LC:memoryBufferWindow, LC:lmChatOpenAi, manualTrigger, httpRequest, compression, readWriteFile |

### Discord  ·  4 workflows

| Workflow | Nodes | Main integrations |
|---|---|---|
| Discord AI-powered bot | 9 | manualTrigger, webhook, openAi, discord |
| Post New Live Tennis Matches to Discord on a Schedule | 6 | scheduleTrigger, httpRequest, splitOut, removeDuplicates, discord |
| Send daily translated Calvin and Hobbes Comics to Discord | 8 | scheduleTrigger, LC:openAi, discord, LC:lmChatOpenAi, LC:informationExtractor, httpRequest |
| Share YouTube Videos with AI Summaries on Discord | 8 | rssFeedReadTrigger, httpRequest, extractFromFile, LC:openAi, discord |

### Forms and Surveys  ·  4 workflows

| Workflow | Nodes | Main integrations |
|---|---|---|
| Conversational Interviews with AI Agents and n8n Forms | 40 | LC:memoryManager, formTrigger, form, crypto, redis, respondToWebhook |
| Email Subscription Service with n8n Forms, Airtable and AI | 32 | scheduleTrigger, airtable, gmail, executeWorkflow, executeWorkflowTrigger, formTrigger |
| Qualifying Appointment Requests with AI & n8n Forms | 25 | formTrigger, form, LC:lmChatOpenAi, gmail, googleCalendar, executeWorkflow |
| Tunova - Generate a song from a form | 5 | formTrigger, httpRequest |

### Gmail and Email Automation  ·  26 workflows

| Workflow | Nodes | Main integrations |
|---|---|---|
| 📈 Receive Daily Market News from FT.com to your Microsoft outlook inbox | 8 | html, httpRequest, scheduleTrigger, LC:lmChatGoogleGemini, LC:agent, microsoftOutlook |
| A Very Simple _Human in the Loop_ Email Response System Using AI and IMAP | 16 | emailReadImap, markdown, emailSend, LC:chainSummarization, LC:agent, LC:lmChatOpenAi |
| AI Email Auto-Responder with Ollama | 6 | scheduleTrigger, emailReadImap, httpRequest |
| AI-powered email processing autoresponder and response approval (Yes_No) | 17 | emailReadImap, markdown, LC:lmChatOpenAi, emailSend, LC:vectorStoreQdrant, LC:embeddingsOpenAi |
| Analyze & Sort Suspicious Email Contents with ChatGPT | 25 | gmailTrigger, microsoftOutlookTrigger, httpRequest, LC:openAi, jira, convertToFile |
| Analyze Suspicious Email Contents with ChatGPT Vision | 18 | gmailTrigger, microsoftOutlookTrigger, httpRequest, LC:openAi, jira |
| Auto Categorise Outlook Emails with AI | 36 | manualTrigger, LC:lmChatOllama, microsoftOutlook, markdown, LC:agent |
| Auto-label incoming Gmail messages with AI nodes | 19 | gmailTrigger, gmail, splitOut, aggregate, LC:chainLlm, LC:outputParserStructured |
| Basic Automatic Gmail Email Labelling with OpenAI and Gmail API | 13 | gmailTrigger, LC:lmChatOpenAi, gmailTool, LC:agent, LC:memoryBufferWindow |
| Classify lemlist replies using OpenAI and automate reply handling | 18 | markdown, lemlistTrigger, LC:lmChatOpenAi, LC:outputParserStructured, slack, lemlist |
| Compose reply draft in Gmail with OpenAI Assistant | 23 | httpRequest, gmail, scheduleTrigger, markdown, LC:openAi, limit |
| create e-mail responses with fastmail and OpenAI | 11 | httpRequest, splitOut, emailReadImap, LC:openAi |
| Daily AI digest of unread emails to Telegram (Italian) | 7 | scheduleTrigger, gmail, LC:openAi, telegram |
| Daily Email Notification | 14 | manualTrigger, scheduleTrigger, executeCommand, httpRequest, telegram |
| Effortless Email Management with AI-Powered Summarization & Review | 31 | emailReadImap, markdown, emailSend, LC:vectorStoreQdrant, LC:embeddingsOpenAi, LC:chainSummarization |
| Email Summary Agent | 9 | scheduleTrigger, gmail, aggregate, LC:openAi |
| Extract spending history from gmail to google sheet | 24 | gmailTrigger, extractFromFile, html, splitOut, LC:outputParserStructured, LC:lmChatGoogleGemini |
| Gmail AI Auto-Responder_ Create Draft Replies to incoming emails | 12 | gmailTrigger, LC:outputParserStructured, LC:lmChatOpenAi, gmail, LC:chainLlm |
| InboxZero Lite - AI Email Classifier | 6 | gmailTrigger, openAi, googleSheets |
| LeadPilot Lite - AI Cold Email Writer | 7 | webhook, openAi, googleSheets, respondToWebhook |
| Microsoft Outlook AI Email Assistant with contact support from Monday and Airtable | 28 | manualTrigger, microsoftOutlook, LC:lmChatOpenAi, LC:outputParserStructured, LC:agent, scheduleTrigger |
| Modular & Customizable AI-Powered Email Routing_ Text Classifier for eCommerce | 14 | formTrigger, LC:textClassifier, LC:lmChatOpenAi, emailSend, googleSheets |
| Send a ChatGPT email reply and save responses to Google Sheets | 49 | openAi, gmailTrigger, gmail, crypto, html, googleSheets |
| Send specific PDF attachments from Gmail to Google Drive using OpenAI | 18 | readPDF, openAi, googleDrive, gmailTrigger |
| Summarize your emails with A.I. (via Openrouter) and send to Line messenger | 7 | emailReadImap, httpRequest |
| Website-Grounded Cold Email Writer | 6 | formTrigger, httpRequest, html, LC:agent, LC:lmChatOpenAi, form |

### Google Drive and Google Sheets  ·  21 workflows

| Workflow | Nodes | Main integrations |
|---|---|---|
| ✨ Vision-Based AI Agent Scraper - with Google Sheets, ScrapingBee, and Gemini | 29 | manualTrigger, httpRequest, LC:outputParserStructured, LC:lmChatGoogleGemini, splitOut, googleSheets |
| Airtable to Google Sheets Auto-Sync | 3 | manualTrigger, airtable, googleSheets |
| Author and Publish Blog Posts From Google Sheets | 35 | scheduleTrigger, manualTrigger, googleSheets, LC:lmChatOpenAi, LC:chainLlm, httpRequest |
| Automated End-to-End Fine-Tuning of OpenAI Models with Google Drive Integration | 9 | manualTrigger, googleDrive, LC:agent, LC:chatTrigger, LC:lmChatOpenAi, LC:openAi |
| Automatic Background Removal for Images in Google Drive | 16 | httpRequest, splitOut, googleDrive, editImage, googleDriveTrigger |
| Automatic payment reminders from Google Sheets (Italian) | 5 | scheduleTrigger, googleSheets, gmail |
| B2B Demo Lead Rescue Desk - Enrich Score Route and Escalate | 26 | webhook, respondToWebhook, httpRequest, googleSheets, gmail |
| Build an OpenAI Assistant with Google Drive Integration | 12 | manualTrigger, googleDrive, LC:chatTrigger, LC:memoryBufferWindow, LC:openAi |
| Chat with a Google Sheet using AI | 19 | executeWorkflowTrigger, googleSheets, LC:toolWorkflow, LC:lmChatOpenAi, LC:chatTrigger, LC:agent |
| Chat with your event schedule from Google Sheets in Telegram | 23 | telegram, googleSheets, LC:agent, telegramTrigger, LC:chatTrigger, LC:lmChatOpenRouter |
| Extract Information from a Logo Sheet using forms, AI, Google Sheet and Airtable | 44 | formTrigger, LC:agent, LC:outputParserStructured, airtable, splitOut, crypto |
| Flux Dev Image Generation (Fal.ai) to Google Drive | 12 | httpRequest, googleDrive, manualTrigger |
| Qualify new leads in Google Sheets via OpenAI_s GPT-4 | 9 | googleSheets, openAi, googleSheetsTrigger |
| RAG Chatbot for Company Documents using Google Drive and Gemini | 18 | LC:vectorStorePinecone, LC:embeddingsGoogleGemini, LC:documentDefaultDataLoader, LC:textSplitterRecursiveCharacterTextSplitter, LC:agent, LC:toolVectorStore |
| RAG_Context-Aware Chunking _ Google Drive to Pinecone via OpenRouter & Gemini | 17 | manualTrigger, LC:lmChatOpenRouter, LC:vectorStorePinecone, LC:embeddingsGoogleGemini, LC:documentDefaultDataLoader, LC:textSplitterRecursiveCharacterTextSplitter |
| Screen Applicants With AI, notify HR and save them in a Google Sheet | 7 | LC:lmChatGoogleGemini, gmail, LC:chainLlm, extractFromFile, formTrigger, googleSheets |
| Simple Expense Tracker with n8n Chat, AI Agent and Google Sheets | 10 | LC:agent, LC:chatTrigger, executeWorkflowTrigger, LC:lmChatOpenAi, LC:memoryBufferWindow, LC:informationExtractor |
| Summarize Google Sheets form feedback via OpenAI_s GPT-4 | 10 | manualTrigger, googleSheets, aggregate, openAi, markdown, gmail |
| Summarize the New Documents from Google Drive and Save Summary in Google Sheet | 12 | googleDocs, LC:toolWikipedia, LC:toolCalculator, googleSheets, googleDriveTrigger, LC:openAi |
| Upload to Instagram and Tiktok from Google Drive | 13 | googleDriveTrigger, googleDrive, errorTrigger, telegram, LC:openAi, writeBinaryFile |
| Website leads to Google Sheets with Telegram alert and auto-reply (Italian) | 6 | webhook, googleSheets, telegram, gmail |

### HR and Recruitment  ·  4 workflows

| Workflow | Nodes | Main integrations |
|---|---|---|
| BambooHR AI-Powered Company Policies and Benefits Chatbot | 50 | manualTrigger, LC:documentDefaultDataLoader, LC:embeddingsOpenAi, LC:textSplitterRecursiveCharacterTextSplitter, LC:memoryBufferWindow, LC:lmChatOpenAi |
| CV Screening with OpenAI | 11 | extractFromFile, httpRequest, manualTrigger |
| HR & IT Helpdesk Chatbot with Audio Transcription | 27 | manualTrigger, httpRequest, extractFromFile, LC:vectorStorePGVector, LC:embeddingsOpenAi, LC:documentDefaultDataLoader |
| HR Job Posting and Evaluation with AI | 36 | formTrigger, airtable, googleDrive, extractFromFile, LC:agent, LC:lmChatOpenAi |

### Instagram Twitter Social Media  ·  14 workflows

| Workflow | Nodes | Main integrations |
|---|---|---|
| AI agent for Instagram DM_inbox. Manychat + Open AI integration | 11 | LC:memoryBufferWindow, LC:lmChatOpenAi, respondToWebhook, webhook, LC:agent |
| AI Social Media Content Generator with Ollama | 6 | manualTrigger, httpRequest |
| Create dynamic Twitter profile banner | 12 | manualTrigger, httpRequest, editImage |
| FlowScribe Lite - AI Content Repurposing 4 Platforms | 12 | webhook, openAi, googleSheets, respondToWebhook |
| Generate Instagram Content from Top Trends with AI Image Generation | 44 | telegram, scheduleTrigger, httpRequest, postgres, LC:openAi, facebookGraphApi |
| Grounded Article to Thread and LinkedIn Post | 4 | formTrigger, LC:agent, LC:lmChatOpenAi, form |
| Monitor X Search with Xquik | 5 | manualTrigger, httpRequest |
| OpenAI-powered tweet generator | 5 | manualTrigger, functionItem, httpRequest, airtable |
| Post New YouTube Videos to X | 6 | twitter, LC:openAi, youTube, scheduleTrigger |
| Reddit AI digest | 15 | manualTrigger, reddit, openAi |
| Social Media Analysis and Automated Email Generation | 19 | httpRequest, LC:lmChatOpenAi, LC:outputParserStructured, LC:chainLlm, emailSend, googleSheetsTrigger |
| Speed Up Social Media Banners With BannerBear.com | 16 | formTrigger, httpRequest, bannerbear, discord, LC:openAi |
| Twitter Virtual AI Influencer | 12 | twitter, scheduleTrigger, manualTrigger, LC:openAi |
| Update Twitter banner using HTTP request | 4 | manualTrigger, start, httpRequest |

### Notion  ·  9 workflows

| Workflow | Nodes | Main integrations |
|---|---|---|
| Add positive feedback messages to a table in Notion | 6 | typeformTrigger, googleCloudNaturalLanguage, notion, slack, trello |
| Analyse papers from Hugging Face with AI and store them in Notion | 11 | scheduleTrigger, splitOut, httpRequest, html, notion, LC:openAi |
| Automate LinkedIn Outreach with Notion and OpenAI | 11 | scheduleTrigger, notion, linkedIn, httpRequest, LC:openAi, aggregate |
| Notion AI Assistant Generator | 24 | notion, LC:outputParserAutofixing, LC:lmChatAnthropic, LC:outputParserStructured, LC:agent, LC:chatTrigger |
| Notion knowledge base AI assistant | 12 | LC:lmChatOpenAi, LC:toolHttpRequest, notion, LC:memoryBufferWindow, LC:agent, LC:chatTrigger |
| Notion to Pinecone Vector Store Integration | 8 | LC:textSplitterTokenSplitter, notionTrigger, notion, summarize, LC:documentDefaultDataLoader, LC:embeddingsGoogleGemini |
| Store Notion_s Pages as Vector Documents into Supabase with OpenAI | 9 | LC:embeddingsOpenAi, LC:textSplitterTokenSplitter, notionTrigger, notion, summarize, LC:documentDefaultDataLoader |
| Turn Emails into AI-Enhanced Tasks in Notion (Multi-User Support) with Gmail, Airtable and Softr | 38 | LC:lmChatOpenAi, LC:toolCalculator, LC:outputParserStructured, gmail, airtable, httpRequest |
| Upsert huge documents in a vector store with Supabase and Notion | 34 | LC:embeddingsOpenAi, LC:textSplitterTokenSplitter, LC:chainRetrievalQa, LC:retrieverVectorStore, LC:lmChatOpenAi, LC:chatTrigger |

### OpenAI and LLMs  ·  90 workflows

| Workflow | Nodes | Main integrations |
|---|---|---|
| ⚡AI-Powered YouTube Video Summarization & Analysis | 12 | webhook, n8n-nodes-youtube-transcription.youtubeTranscripter, splitOut, respondToWebhook, telegram, youTube |
| 🎨 Interactive Image Editor with FLUX.1 Fill Tool for Inpainting | 18 | respondToWebhook, httpRequest, webhook, html |
| 🐋DeepSeek V3 Chat & R1 Reasoning Quick Start | 15 | LC:chatTrigger, LC:agent, LC:lmChatOpenAi, LC:memoryBufferWindow, LC:chainLlm, LC:lmChatOllama |
| 📚 Auto-generate documentation for n8n workflows with GPT and Docsify | 60 | convertToFile, extractFromFile, html, sort, readWriteFile, respondToWebhook |
| 🔐🦙🤖 Private & Local Ollama Self-Hosted AI Assistant | 14 | LC:chatTrigger, LC:chainLlm, LC:lmOllama |
| 🔥📈🤖 AI Agent for n8n Creators Leaderboard - Find Popular Workflows | 43 | httpRequest, limit, aggregate, LC:lmChatOpenAi, executeWorkflowTrigger, LC:chatTrigger |
| 🤖🧑_💻 AI Agent for Top n8n Creators Leaderboard Reporting | 49 | httpRequest, aggregate, LC:lmChatOpenAi, executeWorkflowTrigger, LC:toolWorkflow, convertToFile |
| 🚀 Local Multi-LLM Testing & Performance Tracker | 21 | httpRequest, LC:chatTrigger, dateTime, LC:lmChatOpenAi, googleSheets, splitOut |
| Actioning Your Meeting Next Steps using Transcripts and AI | 28 | LC:lmChatOpenAi, httpRequest, googleDrive, manualTrigger, extractFromFile, googleCalendar |
| Advanced AI Demo (Presented at AI Developers #14 meetup) | 39 | slack, LC:textSplitterRecursiveCharacterTextSplitter, LC:embeddingsOpenAi, LC:documentDefaultDataLoader, LC:lmChatOpenAi, LC:retrieverVectorStore |
| AI Agent _ Google calendar assistant using OpenAI | 13 | LC:chatTrigger, LC:lmChatOpenAi, LC:memoryBufferWindow, googleCalendarTool, LC:agent |
| AI agent chat | 5 | LC:lmChatOpenAi, LC:memoryBufferWindow, LC:toolSerpApi, LC:chatTrigger, LC:agent |
| AI Agent for realtime insights on meetings | 19 | LC:openAi, postgres, postgresTool, httpRequest, supabase, webhook |
| AI agent that can scrape webpages | 20 | LC:manualChatTrigger, LC:lmChatOpenAi, httpRequest, executeWorkflowTrigger, LC:agent, markdown |
| AI Agent To Chat With Files In Supabase Storage | 33 | httpRequest, LC:documentDefaultDataLoader, LC:textSplitterRecursiveCharacterTextSplitter, extractFromFile, LC:embeddingsOpenAi, supabase |
| AI Agent to chat with Supabase_PostgreSQL DB | 11 | LC:chatTrigger, LC:lmChatOpenAi, postgresTool, LC:agent |
| AI Agent to chat with you Search Console Data, using OpenAI and Postgres | 30 | LC:memoryPostgresChat, LC:lmChatOpenAi, webhook, respondToWebhook, LC:toolWorkflow, executeWorkflowTrigger |
| AI Agent with Ollama for current weather and wiki | 10 | LC:manualChatTrigger, LC:toolWikipedia, LC:memoryBufferWindow, LC:agent, LC:toolHttpRequest, LC:lmChatOllama |
| AI Automated HR Workflow for CV Analysis and Candidate Evaluation | 18 | formTrigger, extractFromFile, LC:informationExtractor, LC:chainSummarization, googleSheets, LC:outputParserStructured |
| AI Blog Writer Pipeline with Ollama | 7 | manualTrigger, httpRequest |
| AI chat with any data source (using the n8n workflow tool) | 12 | LC:manualChatTrigger, executeWorkflowTrigger, hackerNews, LC:agent, LC:lmChatOpenAi, LC:toolWorkflow |
| AI chatbot that can search the web | 9 | LC:manualChatTrigger, LC:lmChatOpenAi, LC:toolWikipedia, LC:memoryBufferWindow, LC:toolSerpApi, LC:agent |
| AI Crew to Automate Fundamental Stock Analysis - Q&A Workflow | 17 | LC:embeddingsOpenAi, LC:manualChatTrigger, LC:chainRetrievalQa, respondToWebhook, LC:retrieverVectorStore, webhook |
| AI Customer feedback sentiment analysis | 9 | googleSheets, openAi, formTrigger |
| AI Data Extraction with Dynamic Prompts and Airtable | 51 | httpRequest, extractFromFile, LC:chainLlm, LC:lmChatOpenAi, airtable, webhook |
| AI Data Extraction with Dynamic Prompts and Baserow | 45 | webhook, httpRequest, extractFromFile, LC:chainLlm, splitOut, LC:lmChatOpenAi |
| AI Fitness Coach Strava Data Analysis and Personalized Training Insights | 15 | stravaTrigger, LC:lmChatGoogleGemini, gmail, LC:agent, emailSend, whatsApp |
| AI Powered Web Scraping with Jina, Google Sheets and OpenAI _ the EASY way | 7 | manualTrigger, splitOut, googleSheets, LC:lmChatOpenAi, LC:informationExtractor, httpRequest |
| AI Social Media Caption Creator creates social media post captions in Airtable | 10 | LC:agent, LC:lmChatOpenAi, LC:memoryBufferWindow, airtable, airtableTrigger, airtableTool |
| AI Stock Image Metadata Generator | 7 | webhook, httpRequest, respondToWebhook |
| AI Voice Chat using Webhook, Memory Manager, OpenAI, Google Gemini & ElevenLabs | 15 | LC:memoryManager, aggregate, LC:memoryBufferWindow, LC:lmChatGoogleGemini, respondToWebhook, httpRequest |
| AI Voice Chatbot with ElevenLabs & OpenAI for Customer Service and Restaurants | 23 | LC:agent, LC:toolVectorStore, LC:vectorStoreQdrant, LC:embeddingsOpenAi, manualTrigger, httpRequest |
| AI web researcher for sales | 22 | manualTrigger, LC:lmChatOpenAi, LC:toolWorkflow, LC:toolSerpApi, LC:outputParserStructured, googleSheets |
| AI Youtube Trend Finder Based On Niche | 15 | LC:agent, LC:chatTrigger, LC:toolWorkflow, LC:lmChatOpenAi, LC:memoryBufferWindow, httpRequest |
| AI_ Ask questions about any data source (using the n8n workflow retriever) | 7 | manualTrigger, LC:retrieverWorkflow, LC:chainRetrievalQa, LC:lmChatOpenAi |
| AI_ Summarize podcast episode and enhance using Wikipedia | 19 | manualTrigger, LC:documentJsonInputLoader, LC:textSplitterRecursiveCharacterTextSplitter, LC:chainSummarization, LC:lmChatOpenAi, LC:toolWikipedia |
| AI-Generated Summary Block for WordPress Posts | 32 | manualTrigger, LC:textClassifier, LC:lmChatOpenAi, webhook, scheduleTrigger, httpRequest |
| AI-Powered Candidate Shortlisting Automation for ERPNext | 39 | erpNext, LC:lmChatGoogleGemini, httpRequest, webhook, extractFromFile, LC:agent |
| AI-Powered Email Automation for Business_ Summarize & Respond with RAG | 26 | emailReadImap, markdown, LC:lmChatOpenAi, emailSend, LC:vectorStoreQdrant, LC:embeddingsOpenAi |
| AI-Powered RAG Workflow For Stock Earnings Report Analysis | 18 | LC:vectorStorePinecone, LC:embeddingsGoogleGemini, LC:documentDefaultDataLoader, LC:textSplitterRecursiveCharacterTextSplitter, manualTrigger, LC:agent |
| AI-Powered Social Media Amplifier | 26 | httpRequest, markdown, airtable, linkedIn, twitter, scheduleTrigger |
| AI-powered WooCommerce Support-Agent | 40 | splitOut, aggregate, LC:memoryBufferWindow, executeWorkflowTrigger, wooCommerce, httpRequest |
| Ask a human for help when the AI doesn_t know the answer | 17 | LC:memoryBufferWindow, LC:toolWorkflow, executeWorkflowTrigger, LC:chatTrigger, LC:agent, slack |
| Automate Customer Support Issue Resolution using AI Text Classifier | 36 | LC:lmChatOpenAi, scheduleTrigger, jira, aggregate, LC:outputParserStructured, slack |
| Automate Image Validation Tasks using AI Vision | 11 | manualTrigger, LC:outputParserStructured, splitOut, googleDrive, editImage, LC:chainLlm |
| Automate Your RFP Process with OpenAI Assistants | 23 | extractFromFile, LC:outputParserItemList, googleDocs, LC:lmChatOpenAi, slack, gmail |
| Chat Assistant (OpenAI assistant) with Postgres Memory And API Calling Capabalities | 12 | LC:openAi, LC:chatTrigger, LC:memoryPostgresChat, mySqlTool, LC:toolHttpRequest |
| Chat with local LLMs using n8n and Ollama | 5 | LC:chatTrigger, LC:lmChatOllama, LC:chainLlm |
| Chat with OpenAI Assistant (by adding a memory) | 14 | LC:openAiAssistant, LC:toolCalculator, LC:memoryManager, aggregate, limit, LC:chatTrigger |
| Claude AI Content Generator | 5 | webhook, httpRequest, respondToWebhook |
| Claude AI LINE Chatbot | 5 | webhook, httpRequest, respondToWebhook |
| Claude AI Morning Brief | 4 | scheduleTrigger, httpRequest |
| Claude Smart Webhook AI Router | 5 | webhook, httpRequest, respondToWebhook |
| Configure your own Image Creation API Using OpenAI DALLE-3 | 7 | webhook, respondToWebhook, LC:openAi |
| Convert text to speech with OpenAI | 8 | manualTrigger, httpRequest |
| Create a Branded AI-Powered Website Chatbot | 24 | LC:memoryBufferWindow, respondToWebhook, LC:lmChatOpenAi, LC:toolHttpRequest, executeWorkflowTrigger, httpRequest |
| Custom LangChain agent written in JavaScript | 10 | LC:lmOpenAi, manualTrigger, LC:lmChatOpenAi, LC:code, LC:agent |
| Daily meetings summarization with Gemini AI | 9 | slack, googleCalendarTool, LC:agent, scheduleTrigger, LC:lmChatGoogleGemini |
| Daily Podcast Summary | 21 | gmail, httpRequest, splitOut, html, openAi, scheduleTrigger |
| DaoXE Multi-Model Chat with Automatic Fallback | 7 | manualTrigger, httpRequest |
| Detect hallucinations using specialised Ollama model bespoke-minicheck | 18 | splitOut, LC:chainLlm, LC:lmChatOllama, manualTrigger, executeWorkflowTrigger, aggregate |
| Dynamically generate a webpage from user request using OpenAI Structured Output | 7 | respondToWebhook, httpRequest, LC:openAi, html, webhook |
| Easy Image Captioning with Gemini 1.5 Pro | 16 | manualTrigger, LC:lmChatGoogleGemini, LC:outputParserStructured, editImage, httpRequest, LC:chainLlm |
| Enrich FAQ sections on your website pages at scale with AI | 36 | manualTrigger, LC:lmChatOpenAi, splitOut, aggregate, googleDrive, googleSheets |
| Extract personal data with self-hosted LLM Mistral NeMo | 13 | LC:chatTrigger, LC:lmChatOllama, LC:outputParserAutofixing, LC:outputParserStructured, LC:chainLlm |
| Fetch Dynamic Prompts from GitHub and Auto-Populate n8n Expressions in Prompt | 17 | manualTrigger, github, extractFromFile, stopAndError, LC:agent, LC:lmChatOllama |
| Flux AI Image Generator | 19 | respondToWebhook, s3, formTrigger, httpRequest |
| Force AI to use a specific output format | 11 | manualTrigger, LC:chainLlm, LC:outputParserStructured, LC:outputParserAutofixing, LC:lmChatOpenAi |
| GCF Token Optimization for LLM Tool Responses | 5 | manualTrigger, httpRequest, n8n-nodes-gcf.gcf |
| Generate 9_16 Images from Content and Brand Guidelines | 39 | manualTrigger, airtable, removeDuplicates, splitOut, limit, LC:openAi |
| Generate audio from text using OpenAI and Webhook _ Text to Speech Workflow | 5 | respondToWebhook, webhook, LC:openAi |
| Generate Text-to-Speech Using Elevenlabs via API | 6 | respondToWebhook, webhook, httpRequest |
| Generating Image Embeddings via Textual Summarisation | 22 | manualTrigger, googleDrive, editImage, LC:documentDefaultDataLoader, LC:textSplitterRecursiveCharacterTextSplitter, LC:embeddingsOpenAi |
| Narrating over a Video using Multimodal AI | 21 | LC:lmChatOpenAi, splitOut, httpRequest, convertToFile, manualTrigger, aggregate |
| Ollama_Basic_Workflow | 2 | manualTrigger, httpRequest |
| OpenAI assistant with custom tools | 14 | LC:manualChatTrigger, LC:openAiAssistant, executeWorkflowTrigger, LC:toolWorkflow, summarize, LC:toolCode |
| OpenAI Assistant workflow_ upload file, create an Assistant, chat with it! | 10 | manualTrigger, googleDrive, LC:chatTrigger, LC:openAi |
| OpenAI examples_ ChatGPT, DALLE-2, Whisper-1 – 5-in-1 | 27 | manualTrigger, openAi, httpRequest, html, readBinaryFiles |
| Organise Your Local File Directories With AI | 16 | localFileTrigger, executeCommand, LC:lmChatMistralCloud, LC:outputParserStructured, splitOut, LC:chainLlm |
| Personal Shopper Chatbot for WooCommerce with RAG using Google Drive and openAI | 25 | LC:chatTrigger, LC:memoryBufferWindow, LC:toolCalculator, LC:lmChatOpenAi, LC:toolVectorStore, LC:vectorStoreQdrant |
| Prompt-based Object Detection with Gemini 2.0 | 14 | manualTrigger, httpRequest, editImage |
| Proxmox AI Agent with n8n and Generative AI Integration | 35 | httpRequest, LC:toolHttpRequest, LC:outputParserAutofixing, LC:lmChatGoogleGemini, LC:outputParserStructured, LC:chatTrigger |
| Query n8n Credentials with AI SQL Agent | 13 | manualTrigger, LC:chatTrigger, LC:toolCode, LC:lmChatOpenAi, LC:memoryBufferWindow, LC:agent |
| Suggest meeting slots using AI | 21 | gmailTrigger, LC:lmChatOpenAi, LC:toolWorkflow, googleCalendar, executeWorkflowTrigger, LC:chainLlm |
| Summarize YouTube Videos from Transcript | 10 | httpRequest, LC:chainSummarization, formTrigger, LC:lmChatOpenAi |
| SupportFlow Lite - Simple AI Customer Support Chatbot | 7 | webhook, openAi, googleSheets, respondToWebhook |
| Transform Image to Lego Style Using Line and Dall-E | 5 | webhook, httpRequest, LC:openAi |
| Translate audio using AI | 12 | LC:lmChatOpenAi, manualTrigger, httpRequest, LC:chainLlm |
| Use OpenRouter in n8n versions _1.78 | 8 | LC:chatTrigger, LC:agent, LC:memoryBufferWindow, LC:lmChatOpenAi |
| YouTube Transcript to Executive Summary (Free) | 6 | webhook, openAi, respondToWebhook |

### Other Integrations and Use Cases  ·  45 workflows

| Workflow | Nodes | Main integrations |
|---|---|---|
| Analyze feedback and send a message on Mattermost | 5 | typeformTrigger, googleCloudNaturalLanguage, mattermost |
| Analyze feedback using AWS Comprehend and send it to a Mattermost channel | 5 | mattermost, awsComprehend, typeformTrigger |
| API Schema Extractor | 88 | manualTrigger, httpRequest, splitOut, LC:textSplitterRecursiveCharacterTextSplitter, LC:documentDefaultDataLoader, executeWorkflowTrigger |
| Automate Pinterest Analysis & AI-Powered Content Suggestions With Pinterest API | 13 | LC:lmChatOpenAi, airtableTool, scheduleTrigger, httpRequest, airtable, LC:agent |
| Automate Screenshots with URLbox & Analyze them with AI | 9 | httpRequest, LC:openAi, manualTrigger |
| Automate SIEM Alert Enrichment with MITRE ATT&CK, Qdrant & Zendesk in n8n | 26 | LC:chatTrigger, LC:agent, LC:lmChatOpenAi, splitOut, LC:embeddingsOpenAi, LC:documentDefaultDataLoader |
| Automate testimonials in Strapi with n8n | 14 | strapi, interval, twitter, webhook, googleCloudNaturalLanguage |
| Bitrix24 Chatbot Application Workflow example with Webhook Integration | 13 | webhook, httpRequest, respondToWebhook |
| ChatGPT Automatic Code Review in Gitlab MR | 14 | webhook, splitOut, LC:lmChatOpenAi, httpRequest, LC:chainLlm |
| Classify new bugs in Linear with OpenAI_s GPT-4 and move them to the right team | 12 | linearTrigger, linear, httpRequest, slack, LC:openAi |
| ClientFlow Lite - Client Onboarding Automation | 6 | webhook, gmail, googleSheets, respondToWebhook |
| Create and send Pennylane invoices from webhook data | 25 | webhook, httpRequest |
| Create, update, and get a profile in Humantic AI | 5 | manualTrigger, humanticAi, httpRequest |
| Deterministic Exact-Match Quote Guard for AI and OCR Inputs | 10 | webhook, respondToWebhook |
| Enhance Customer Chat by Buffering Messages with Twilio and Redis | 18 | LC:lmChatOpenAi, redis, LC:memoryBufferWindow, twilioTrigger, twilio, LC:memoryManager |
| Extract source-backed company website metadata with Apify | 6 | manualTrigger, httpRequest |
| Generate Seedance videos with Vancine API and bounded polling | 24 | manualTrigger, httpRequest, stopAndError |
| glasp-highlights-export-workflow | 7 | scheduleTrigger, httpRequest |
| Hacker News Throwback Machine - See What Was Hot on This Day, Every Year! | 13 | LC:chainLlm, LC:lmChatGoogleGemini, scheduleTrigger, splitOut, httpRequest, html |
| Handling Appointment Leads and Follow-up With Twilio, Cal.com and AI | 36 | twilioTrigger, LC:lmChatOpenAi, airtable, twilio, scheduleTrigger, LC:outputParserStructured |
| Integrating AI with Open-Meteo API for Enhanced Weather Forecasting | 12 | LC:chatTrigger, LC:lmChatOpenAi, LC:agent, LC:memoryBufferWindow, LC:toolHttpRequest |
| Introduction to the HTTP Tool | 12 | LC:lmChatOpenAi, LC:toolHttpRequest, LC:agent, manualTrigger |
| Issue a verifiable certificate (Attestify) | 2 | manualTrigger, httpRequest |
| KB Tool - Confluence Knowledge Base | 7 | executeWorkflowTrigger, httpRequest |
| Komos Regulated Browser Ops Task Queue | 5 | manualTrigger, httpRequest |
| Latchshot — capture a public webpage | 4 | manualTrigger, httpRequest |
| LINE Assistant with Google Calendar and Gmail Integration | 14 | LC:agent, LC:memoryBufferWindow, LC:lmChatOpenAi, LC:toolWikipedia, LC:openAi, webhook |
| Monthly Spotify Track Archiving and Playlist Classification | 37 | httpRequest, splitOut, LC:lmChatAnthropic, spotify, LC:outputParserStructured, limit |
| Obsidian Notes Read Aloud using AI_ Available as a Podcast Feed | 23 | LC:openAi, webhook, httpRequest, aggregate, respondToWebhook, googleSheets |
| Optimize & Update Printify Title and Description Workflow | 26 | manualTrigger, httpRequest, splitOut, LC:toolCalculator, LC:toolWikipedia, googleSheetsTrigger |
| Qualify replies from Pipedrive persons with AI | 11 | pipedrive, openAi, gmailTrigger |
| Resilient REST API Sync with Retries, Validation, and Sanitized Errors | 13 | manualTrigger, httpRequest |
| Signed Webhook HMAC Guard with Timestamp Window | 7 | webhook, crypto, respondToWebhook |
| Siri AI Agent_ Apple Shortcuts powered voice template | 7 | LC:lmChatOpenAi, respondToWebhook, LC:agent, webhook |
| Synthetic Candidate Intake Reliability Harness | 3 | manualTrigger |
| Text automations using Apple Shortcuts | 10 | respondToWebhook, webhook, LC:openAi |
| Transcribe authorized PT-BR support calls with speaker labels using Apify | 6 | manualTrigger, httpRequest |
| Transport_Request_Intake_Lite | 5 | webhook, respondToWebhook |
| Tunova - Generate a song via webhook | 5 | webhook, httpRequest, respondToWebhook |
| Use AI to organize your Todoist Inbox | 12 | todoist, scheduleTrigger, LC:openAi |
| Using External Workflows as Tools in n8n | 4 | executeWorkflowTrigger, httpRequest |
| UTM Link Creator & QR Code Generator with Scheduled Google Analytics Reports | 14 | LC:lmChatOpenAi, LC:memoryBufferWindow, googleAnalyticsTool, manualTrigger, airtable, httpRequest |
| Visualize your SQL Agent queries with OpenAI and Quickchart.io | 19 | LC:lmChatOpenAi, executeWorkflow, executeWorkflowTrigger, httpRequest, LC:chatTrigger, LC:agent |
| VoiceAgent Lite - Phone Call Logger | 5 | webhook, googleSheets, respondToWebhook |
| Zoom AI Meeting Assistant creates mail summary, ClickUp tasks and follow-up call | 24 | LC:lmChatOpenAi, manualTrigger, stopAndError, zoom, httpRequest, extractFromFile |

### PDF and Document Processing  ·  17 workflows

| Workflow | Nodes | Main integrations |
|---|---|---|
| Ask questions about a PDF using AI | 16 | googleDrive, LC:textSplitterRecursiveCharacterTextSplitter, LC:embeddingsOpenAi, LC:documentDefaultDataLoader, LC:chainRetrievalQa, LC:lmChatOpenAi |
| Breakdown Documents into Study Notes using Templating MistralAI and Qdrant | 42 | localFileTrigger, LC:documentDefaultDataLoader, LC:textSplitterRecursiveCharacterTextSplitter, LC:embeddingsMistralCloud, LC:lmChatMistralCloud, splitOut |
| Chat with PDF docs using AI (quoting sources) | 22 | manualTrigger, LC:embeddingsOpenAi, LC:documentDefaultDataLoader, googleDrive, LC:chatTrigger, LC:lmChatOpenAi |
| Convert URL HTML to Markdown Format and Get Page Links | 17 | manualTrigger, limit, splitOut, httpRequest |
| CV Resume PDF Parsing with Multimodal Vision AI | 13 | manualTrigger, LC:outputParserStructured, googleDrive, httpRequest, editImage, LC:lmChatGoogleGemini |
| ETL pipeline for text processing | 9 | twitter, postgres, mongoDb, slack, googleCloudNaturalLanguage, cron |
| Extract and process information directly from PDF using Claude and Gemini | 11 | manualTrigger, extractFromFile, googleDrive, httpRequest |
| Extract data from resume and create PDF with Gotenberg | 43 | LC:lmChatOpenAi, LC:outputParserAutofixing, LC:outputParserStructured, telegramTrigger, telegram, extractFromFile |
| Extract license plate number from image uploaded via an n8n form | 5 | LC:chainLlm, form, LC:lmChatOpenRouter, formTrigger |
| Extract text from PDF and image using Vertex AI (Gemini) into CSV | 16 | LC:lmChatGoogleGemini, googleDriveTrigger, googleDrive, extractFromFile, httpRequest, convertToFile |
| Invoice data extraction with human-in-the-loop validation and auto-training using Cradl AI | 10 | gmailTrigger, googleSheets, gmail, @cradl/n8n-nodes-cradlai.cradlAi, splitOut |
| Invoice data extraction with LlamaParse and OpenAI | 26 | LC:lmOpenAi, LC:outputParserStructured, httpRequest, gmailTrigger, googleSheets, gmail |
| Manipulate PDF with Adobe developer API | 20 | manualTrigger, httpRequest, executeWorkflowTrigger, dropbox |
| Prepare CSV files with GPT-4 | 11 | manualTrigger, openAi, spreadsheetFile, writeBinaryFile, moveBinaryData |
| Remove Personally Identifiable Information (PII) from CSV Files with OpenAI | 10 | googleDriveTrigger, googleDrive, extractFromFile, LC:openAi, splitOut |
| Transcribe Audio Files, Summarize with GPT-4, and Store in Notion | 8 | googleDriveTrigger, googleDrive, notion, LC:openAi |
| Transcribing Bank Statements To Markdown Using Gemini Vision AI | 20 | manualTrigger, LC:lmChatGoogleGemini, sort, googleDrive, httpRequest, compression |

### Slack  ·  9 workflows

| Workflow | Nodes | Main integrations |
|---|---|---|
| AI-Powered Information Monitoring with OpenAI, Google Sheets, Jina AI and Slack | 31 | LC:lmChatOpenAi, LC:chainLlm, scheduleTrigger, rssFeedRead, LC:textClassifier, googleSheets |
| Creating a AI Slack Bot with Google Gemini | 10 | LC:lmChatGoogleGemini, LC:memoryBufferWindow, slack, webhook, LC:agent |
| Customer Support Channel and Ticketing System with Slack and Linear | 19 | slack, LC:lmChatOpenAi, LC:outputParserStructured, scheduleTrigger, linear, LC:chainLlm |
| Enhance Security Operations with the Qualys Slack Shortcut Bot! | 23 | executeWorkflow, httpRequest, respondToWebhook, webhook |
| Enrich Pipedrive_s Organization Data with OpenAI GPT-4o & Notify it in Slack | 8 | pipedriveTrigger, pipedrive, httpRequest, markdown, slack, LC:openAi |
| IT Ops AI SlackBot Workflow - Chat with your knowledge base | 20 | respondToWebhook, LC:lmChatOpenAi, LC:memoryBufferWindow, slack, webhook, LC:toolWorkflow |
| Sentiment Analysis Tracking on Support Issues with Linear and Slack | 19 | splitOut, LC:lmChatOpenAi, LC:informationExtractor, airtable, airtableTrigger, graphql |
| Slack slash commands AI Chat Bot | 11 | webhook, LC:chainLlm, LC:lmChatOpenAi, slack |
| Venafi Cloud Slack Cert Bot | 38 | venafiTlsProtectCloud, respondToWebhook, httpRequest, executeWorkflow, LC:openAi, slack |

### Telegram  ·  26 workflows

| Workflow | Nodes | Main integrations |
|---|---|---|
| 🐋🤖 DeepSeek AI Agent + Telegram + LONG TERM Memory 🧠 | 23 | telegram, webhook, LC:agent, LC:memoryBufferWindow, LC:chatTrigger, googleDocsTool |
| 🤖 Telegram Messaging Agent for Text_Audio_Images | 39 | telegram, webhook, httpRequest, LC:lmChatOpenAi, LC:openAi, convertToFile |
| 🤖🧠 AI Agent Chatbot + LONG TERM Memory + Note Storage + Telegram | 21 | LC:chatTrigger, LC:lmChatOpenAi, LC:memoryBufferWindow, googleDocsTool, googleDocs, telegram |
| Agentic Telegram AI bot with with LangChain nodes and new tools | 8 | LC:lmChatOpenAi, LC:memoryBufferWindow, telegramTrigger, telegram, telegramTool, LC:toolHttpRequest |
| AI-Powered Children_s Arabic Storytelling on Telegram | 15 | LC:lmChatOpenAi, scheduleTrigger, LC:textSplitterRecursiveCharacterTextSplitter, LC:chainSummarization, LC:openAi, telegram |
| AI-Powered Children_s English Storytelling on Telegram with OpenAI | 14 | LC:lmChatOpenAi, scheduleTrigger, LC:chainSummarization, LC:textSplitterRecursiveCharacterTextSplitter, LC:openAi, telegram |
| Angie, Personal AI Assistant with Telegram Voice and Text | 15 | googleCalendarTool, LC:memoryBufferWindow, gmailTool, LC:lmChatOpenAi, telegramTrigger, telegram |
| Automated AI image analysis and response via Telegram | 8 | telegramTrigger, telegram, LC:openAi |
| Bitcoin price alert to Telegram with CoinPaprika | 5 | scheduleTrigger, httpRequest, telegram |
| Chat with OpenAIs GPT via a simple Telegram Bot | 4 | telegramTrigger, LC:lmChatOpenAi, LC:agent, telegram |
| Detect toxic language in Telegram messages | 5 | telegramTrigger, googlePerspective, telegram |
| Image Creation with OpenAI and Telegram | 12 | telegramTrigger, LC:openAi, telegram, aggregate |
| Internship Informer | 30 | telegramTrigger, LC:agent, httpRequest, httpRequestTool, LC:lmChatGroq, dataTableTool |
| ResumeBot | 98 | telegram, telegramTrigger, supabase, ssh, extractFromFile, LC:agent |
| RSS Keyword Alert to Telegram | 4 | scheduleTrigger, httpRequest, telegram |
| Send a random recipe once a day to Telegram | 15 | cron, airtable, telegram, httpRequest, telegramTrigger |
| TeleBot_KnowledgeHub | 15 | LC:memoryBufferWindow, LC:vectorStoreInMemory, LC:textSplitterRecursiveCharacterTextSplitter, LC:documentDefaultDataLoader, telegram, formTrigger |
| Telegram AI bot assistant_ ready-made template for voice & text messages | 15 | LC:lmChatOpenAi, LC:memoryBufferWindow, telegram, telegramTrigger, LC:openAi, LC:agent |
| Telegram AI bot with LangChain nodes | 12 | LC:lmChatOpenAi, LC:memoryBufferWindow, telegram, executeWorkflowTrigger, telegramTrigger, LC:toolWorkflow |
| Telegram AI Bot_ NeurochainAI Text & Image - NeurochainAI Basic API Integration | 29 | telegramTrigger, httpRequest, telegram |
| Telegram AI Chatbot | 16 | telegramTrigger, openAi, telegram |
| Telegram AI Support Bot with Conversation Memory | 5 | telegramTrigger, LC:agent, LC:lmChatOpenAi, LC:memoryBufferWindow, telegram |
| Telegram Bot with Supabase memory and OpenAI assistant integration | 17 | telegramTrigger, httpRequest, supabase, telegram |
| Telegram chat with PDF | 20 | telegramTrigger, LC:embeddingsOpenAi, LC:documentDefaultDataLoader, LC:textSplitterRecursiveCharacterTextSplitter, stopAndError, LC:chainRetrievalQa |
| Telegram to Spotify with OpenAI | 14 | telegramTrigger, LC:openAi, spotify, telegram |
| Translate Telegram audio messages with AI (55 supported languages) | 13 | telegramTrigger, telegram, LC:lmChatOpenAi, LC:chainLlm, LC:openAi |

### WhatsApp  ·  8 workflows

| Workflow | Nodes | Main integrations |
|---|---|---|
| Automate Sales Meeting Prep with AI & APIFY Sent To WhatsApp | 61 | gmail, googleCalendar, LC:lmChatOpenAi, LC:informationExtractor, executeWorkflowTrigger, whatsApp |
| Building Your First WhatsApp Chatbot | 28 | whatsAppTrigger, LC:lmChatOpenAi, LC:memoryBufferWindow, LC:toolVectorStore, LC:embeddingsOpenAi, manualTrigger |
| Capture WhatsApp Leads to Google Sheets with Instant Hebrew Auto-Reply | 7 | webhook, googleSheets, httpRequest |
| Complete business WhatsApp AI-Powered RAG Chatbot using OpenAI | 24 | respondToWebhook, LC:agent, LC:lmChatOpenAi, manualTrigger, LC:vectorStoreQdrant, httpRequest |
| LeadBot 24h - AI WhatsApp Lead Qualification | 6 | webhook, googleSheets, httpRequest, whatsApp |
| Receive and Send Messages Across WhatsApp, Instagram and Facebook Messenger with Fiwano | 6 | n8n-nodes-fiwano.fiwanoTrigger, n8n-nodes-fiwano.fiwano |
| Respond to WhatsApp Messages with AI Like a Pro! | 35 | whatsAppTrigger, whatsApp, httpRequest, LC:memoryBufferWindow, splitOut, LC:toolWikipedia |
| Send Escalating WhatsApp Invoice Reminders from Google Sheets (Hebrew) | 9 | scheduleTrigger, googleSheets, httpRequest |

### WordPress  ·  6 workflows

| Workflow | Nodes | Main integrations |
|---|---|---|
| Auto-Categorize blog posts in wordpress using A.I. | 9 | manualTrigger, wordpress, LC:lmChatOpenAi, LC:agent |
| Auto-Tag Blog Posts in WordPress with AI | 32 | LC:lmChatOpenAi, LC:outputParserAutofixing, LC:outputParserStructured, rssFeedReadTrigger, splitOut, httpRequest |
| Automate Blog Creation in Brand Voice with AI | 27 | manualTrigger, LC:lmChatOpenAi, LC:informationExtractor, httpRequest, html, splitOut |
| Automate Content Generator for WordPress with DeepSeek R1 | 17 | manualTrigger, googleSheets, wordpress, httpRequest, LC:openAi |
| WordPress - AI Chatbot to enhance user experience - with Supabase and OpenAI | 53 | manualTrigger, LC:embeddingsOpenAi, LC:documentDefaultDataLoader, LC:textSplitterTokenSplitter, LC:lmChatOpenAi, LC:memoryPostgresChat |
| Write a WordPress post with AI (starting from a few keywords) | 37 | formTrigger, splitOut, wordpress, httpRequest, respondToWebhook, LC:openAi |

### devops  ·  5 workflows

| Workflow | Nodes | Main integrations |
|---|---|---|
| disk-space-watchdog | 6 | scheduleTrigger, ssh, telegram, emailSend |
| docker-compose-controller | 13 | webhook, ssh, respondToWebhook, stopAndError |
| linux-update-via-webhook | 4 | webhook, ssh, respondToWebhook |
| n8n-failed-execution-doctor | 2 | executeWorkflowTrigger |
| uptime-ping-alert | 4 | scheduleTrigger, httpRequest, telegram |

---

## The 8 files that would not parse

Saved but not indexed — malformed JSON upstream, not damage from archiving:

- `AI_Research_RAG_and_Data_Analysis/Host Your Own AI Deep Research Agent with n8n, Apify and OpenAI o3.json`
- `AI_Research_RAG_and_Data_Analysis/Recipe Recommendations with Qdrant and Mistral.json`
- `AI_Research_RAG_and_Data_Analysis/🔍 Perplexity Research to HTML_ AI-Powered Content Creation.json`
- `Notion/Automate Competitor Research with Exa.ai, Notion and AI Agents.json`
- `OpenAI_and_LLMs/AI-Driven Lead Management and Inquiry Automation with ERPNext & n8n.json`
- `OpenAI_and_LLMs/lemlist __ GPT-3_ Supercharge your sales workflows.json`
- `Other/ALL_unique_nodes.json`
- `PDF_and_Document_Processing/Parse PDF with LlamaParse and save to Airtable.json`
