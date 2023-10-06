const express = require('express')
const axios = require('axios')
const app = express()
const PORT = 3000

app.use(express.json())


const fetchNums = async (url) => {
    try {
        const res = await axios.get(url)
        if(res.status === 200){
            const data = res.data
            return new Set(data.numbers)
        }
        
    } catch (error) {
        console.log(error);
    }

    return new Set()
}


app.get('/numbers', async (req, res) => {

    const urls = req.query.url;
    
  if (!urls || !Array.isArray(urls)) {
    return res.status(400).json({ error: 'Invalid URLs provided' });
  }

  const mergedNumbers = new Set();

  try {
    const promises = urls.map((url) => fetchNums(url));
    const results = await Promise.all(promises);

    results.forEach((numbers) => {
      numbers.forEach((number) => {
        mergedNumbers.add(number);
      });
    });
    const sortedNumbers = Array.from(mergedNumbers).sort((a, b) => a - b);

    return res.json({ numbers: sortedNumbers });
  } catch (error) {
    return res.status(500).json({ error: 'something went wrong' });
  }
})

app.listen(3000, () => console.log(`server listening to port ${PORT}`))
