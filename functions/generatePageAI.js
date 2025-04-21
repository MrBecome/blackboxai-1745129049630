const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { Configuration, OpenAIApi } = require("openai");

admin.initializeApp();

const configuration = new Configuration({
  apiKey: functions.config().openai.key,
});
const openai = new OpenAIApi(configuration);

exports.generatePageAI = functions.https.onCall(async (data, context) => {
  // Authentication check
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be authenticated to call this function."
    );
  }

  const { pageTitle, prompt } = data;

  if (!pageTitle || !prompt) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "The function must be called with pageTitle and prompt."
    );
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: 1000,
    });

    const content = completion.data.choices[0].text.trim();

    // Save to Firestore
    const pageRef = admin.firestore().collection("pages").doc(pageTitle);
    await pageRef.set({ content });

    return { success: true, content };
  } catch (error) {
    console.error("Error generating AI page:", error);
    throw new functions.https.HttpsError("internal", error.message);
  }
});
