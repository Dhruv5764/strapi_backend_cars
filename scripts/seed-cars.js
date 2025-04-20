const axios = require('axios');
const FormData = require('form-data');

const STRAPI_URL = 'http://localhost:1337';
const ADMIN_TOKEN = 'b5e54e9824b82fef4ca9870bd1cc9788629035508da471793c6dc83115cb1864a0006332bc8048a90a2fbf0d5779ce152a4ec3a2be33c6353864267d9e0814802db4c1c122dc75bde9fde160c97f24fde3480af4e5a9bcf65d22111498cfc83aa104fbe33d09cb457123f9e99bfa5ccc89800dd2d412285fe8927b186980a9c7';

const carData = [
    {
      name: "Toyota Fortuner",
      description: "A powerful SUV with great off-road capability.",
      price: 3500000,
      specifications: { mileage: "12.5 kmpl", engine: "2755 cc", transmission: "Automatic" },
      image: "https://i.imgur.com/8sKxTUV.jpg"
    },
    {
      name: "Hyundai Creta",
      description: "Compact SUV with premium features.",
      price: 1500000,
      specifications: { mileage: "17.4 kmpl", engine: "1493 cc", transmission: "Manual" },
      image: "https://i.imgur.com/BWUZyHH.jpg"
    },
    {
      name: "Honda City",
      description: "A sedan loved for its comfort and style.",
      price: 1300000,
      specifications: { mileage: "18.4 kmpl", engine: "1498 cc", transmission: "CVT" },
      image: "https://i.imgur.com/h9qRkCF.jpg"
    },
    {
      name: "Mahindra Thar",
      description: "A rugged off-roader built for adventure.",
      price: 1800000,
      specifications: { mileage: "15.2 kmpl", engine: "2184 cc", transmission: "Manual" },
      image: "https://i.imgur.com/LcXZzH0.jpg"
    },
    {
      name: "Tata Nexon",
      description: "India’s safest compact SUV.",
      price: 1200000,
      specifications: { mileage: "16.8 kmpl", engine: "1199 cc", transmission: "AMT" },
      image: "https://i.imgur.com/jhnRnCJ.jpg"
    },
    {
      name: "Maruti Suzuki Swift",
      description: "A hatchback that blends performance with efficiency.",
      price: 800000,
      specifications: { mileage: "21.2 kmpl", engine: "1197 cc", transmission: "Manual" },
      image: "https://i.imgur.com/nPzFvJ5.jpg"
    },
    {
      name: "Kia Seltos",
      description: "Stylish SUV with advanced features.",
      price: 1600000,
      specifications: { mileage: "16.5 kmpl", engine: "1497 cc", transmission: "iMT" },
      image: "https://i.imgur.com/Z6a3kkU.jpg"
    },
    {
      name: "MG Hector",
      description: "Spacious family SUV with smart features.",
      price: 1700000,
      specifications: { mileage: "15.8 kmpl", engine: "1451 cc", transmission: "CVT" },
      image: "https://i.imgur.com/6fvKSpO.jpg"
    },
    {
      name: "Volkswagen Virtus",
      description: "A sporty sedan with turbocharged performance.",
      price: 1400000,
      specifications: { mileage: "18.1 kmpl", engine: "999 cc", transmission: "DSG" },
      image: "https://i.imgur.com/EkZDYbx.jpg"
    },
    {
      name: "Skoda Kushaq",
      description: "A dynamic SUV with European styling.",
      price: 1500000,
      specifications: { mileage: "17.7 kmpl", engine: "1498 cc", transmission: "Automatic" },
      image: "https://i.imgur.com/w1dxhrX.jpg"
    },
    {
      name: "Maruti Suzuki Baleno",
      description: "Premium hatchback with comfort and style.",
      price: 900000,
      specifications: { mileage: "22.3 kmpl", engine: "1197 cc", transmission: "AMT" },
      image: "https://i.imgur.com/0iEum53.jpg"
    },
    {
      name: "Renault Kiger",
      description: "Affordable compact SUV with bold styling.",
      price: 750000,
      specifications: { mileage: "19.0 kmpl", engine: "999 cc", transmission: "AMT" },
      image: "https://i.imgur.com/1rwiI4a.jpg"
    },
    {
      name: "Toyota Glanza",
      description: "Premium hatchback with smooth ride.",
      price: 850000,
      specifications: { mileage: "22.0 kmpl", engine: "1197 cc", transmission: "AMT" },
      image: "https://i.imgur.com/jrQSoVT.jpg"
    },
    {
      name: "Ford EcoSport",
      description: "Sporty compact SUV with strong build.",
      price: 1100000,
      specifications: { mileage: "15.9 kmpl", engine: "1496 cc", transmission: "Manual" },
      image: "https://i.imgur.com/yqDdbol.jpg"
    },
    {
      name: "Tata Punch",
      description: "Micro SUV with high safety rating.",
      price: 700000,
      specifications: { mileage: "18.8 kmpl", engine: "1199 cc", transmission: "Manual" },
      image: "https://i.imgur.com/FRhHSeW.jpg"
    },
    {
      name: "Hyundai Venue",
      description: "Urban SUV with stylish interiors.",
      price: 1200000,
      specifications: { mileage: "18.1 kmpl", engine: "998 cc", transmission: "DCT" },
      image: "https://i.imgur.com/wlwLvXq.jpg"
    },
    {
      name: "Nissan Magnite",
      description: "Budget-friendly SUV with powerful design.",
      price: 750000,
      specifications: { mileage: "18.75 kmpl", engine: "999 cc", transmission: "CVT" },
      image: "https://i.imgur.com/RAykmJe.jpg"
    },
    {
      name: "Jeep Compass",
      description: "Premium SUV with off-road capabilities.",
      price: 2500000,
      specifications: { mileage: "17.1 kmpl", engine: "1956 cc", transmission: "Automatic" },
      image: "https://i.imgur.com/JeHYbVe.jpg"
    },
    {
      name: "MG ZS EV",
      description: "Electric SUV with modern tech.",
      price: 2300000,
      specifications: { battery: "50.3 kWh", range: "461 km", charging: "AC & DC Fast" },
      image: "https://i.imgur.com/pkTwYxO.jpg"
    },
    {
      name: "Tata Tiago EV",
      description: "Affordable electric hatchback.",
      price: 950000,
      specifications: { battery: "24 kWh", range: "250 km", charging: "Fast & Regular" },
      image: "https://i.imgur.com/1p4AeRZ.jpg"
    }
  ];
  
  
  

async function downloadImage(url) {
  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0' // some servers block axios requests without a User-Agent
      }
    });
    return Buffer.from(response.data, 'binary');
  } catch (err) {
    console.error(`❌ Error downloading image from ${url}:`, err.message);
    throw err;
  }
}

async function uploadImageFromUrl(url, filename) {
  const buffer = await downloadImage(url);

  const form = new FormData();
  form.append('files', buffer, { filename, contentType: 'image/jpeg' });

  try {
    const res = await axios.post(`${STRAPI_URL}/api/upload`, form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${ADMIN_TOKEN}`,
      },
    });

    return res.data[0].id;
  } catch (err) {
    console.error(`❌ Error uploading image ${filename}:`, err.response?.data || err.message);
    throw err;
  }
}

async function seed() {
  for (const car of carData) {
    try {
      const fileName = `${car.name.replace(/\s+/g, '_')}.jpg`;
      const imageId = await uploadImageFromUrl(car.image, fileName);

      const res = await axios.post(`${STRAPI_URL}/api/cars`, {
        data: {
          name: car.name,
          description: car.description,
          price: car.price,
          specifications: car.specifications,
          image: imageId,
        }
      }, {
        headers: {
          Authorization: `Bearer ${ADMIN_TOKEN}`
        }
      });

      console.log(`✔️ Added: ${car.name}`);
    } catch (err) {
      console.error(`❌ Failed for ${car.name}:`, err.message);
    }
  }
}

seed();
