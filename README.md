# AI-Powered CV: Anonymization, Reformatting & Agentic AI

## Overview

This project is a **Next.js** web application designed to:

1. **Parse and Anonymize** a CV by removing personal data while retaining essential information.
2. **Reformat** the CV into a consistent, user-friendly layout.
3. Display the **updated CV** in a **rich text editor** for user adjustments.
4. Incorporate an **agentic AI component** to enhance the CV process or recruitment pipeline.

**Demo Link:** [Here](https://ats-ai-challenge.vercel.app/)

## Features

- **CV Input**: Upload or select a sample CV.
- **Anonymization**: Remove personally identifiable information.
- **Reformatting**: Organize the CV into a consistent layout.
- **User Review**: Edit the updated CV in a rich text editor.
- **Agentic AI**: Implement a multi-step AI process to assist in one aspect of the project.

## Technical Stack

- **Framework**: Next.js
- **UI Library**: [shadcn/ui](https://ui.shadcn.com/)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js
- npm or yarn

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/rgprajeen/ats-ai.git
   cd ats-ai
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Add your OpenAI API Key to a `.env` file.

### Running the Application

1. Start the development server:

   ```sh
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:3000`.

### Deployment

Deploy the application to Vercel by following their [deployment guide](https://vercel.com/docs).

## Testing

Run unit tests to ensure quality:

```sh
npm run test
```

## Assumptions

1. **CV Parsing**: The application assumes that the uploaded CVs are in a format that can be parsed effectively (e.g., PDF, DOCX, or plain text).

2. **Anonymization**: The anonymization process will remove all personally identifiable information (PII) such as phone numbers, email addresses, and social media links. Only the first name may be retained if necessary.

3. **Reformatting**: The reformatting process will follow a consistent layout as provided in the sample-formatted-cv.pdf. This includes using headings, bold text, and bullet points for clarity.

4. **Agentic AI Component**: The AI component will use a multi-step approach involving specialized assistants (formatter, enhancer, anonymizer, linguist) to process the CV. Each assistant has a specific role and will not be referred to by name during the process.

5. **Language and Formatting**: The linguist assistant will handle language-related tasks to ensure proper grammar and structure without changing the overall meaning of the content.

6. **Sensitive Information Handling**: The anonymizer will prioritize caution and remove any ambiguous information to ensure no PII escapes the anonymization stage.
