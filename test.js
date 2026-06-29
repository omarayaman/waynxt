import axios from 'axios';

async function test() {
  try {
    const res = await axios.get('https://3rabiii-waynex.hf.space/api/places/1');
    console.log(JSON.stringify(res.data, null, 2));
  } catch (e) {
    console.error("Error:", e.message);
    if (e.response) {
      console.error(e.response.status);
      console.error(e.response.data);
    }
  }
}
test();
