const token = process.env.PWNED_KEY ?? ''

export default {
  api: 'https://api.pwnedpasswords.com',
  headers: {
    'user-agent': 'contacts',
    'hibp-api-key': token,
  },
}
