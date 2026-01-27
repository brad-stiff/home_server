import 'dotenv/config';

export default {
  expo: {
    extra: {
      api_url: process.env.EXPO_PUBLIC_API_URL,
    },
  },
};

