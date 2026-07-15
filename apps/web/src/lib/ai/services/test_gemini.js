async function testLiveAPI() {
  const url = "https://epitometrc-web.vercel.app/api/ai/parse-resume";
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        fileName: "Mudigonda_Lalitha_Sreya_Resume.pdf",
        fileContent: "Test content"
      })
    });

    console.log("Status:", response.status);
    const data = await response.json();
    console.log("Response Body:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error connecting to live API:", error);
  }
}

testLiveAPI();
