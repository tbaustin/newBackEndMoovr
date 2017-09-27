import axios from 'axios';

const sysAuthHash = '7c0a25c06ea30bae50e39a37a5997e31a1a96e20';
const sysApiURL = 'https://d2fzm6xoa70bg8.cloudfront.net';

const sysApiLoginURL = `${sysApiURL}/login?auth=${sysAuthHash}`;
const sysApiWalletpassphraseURL = `${sysApiURL}/walletpassphrase`;
const sysApiOffernewURL = `${sysApiURL}/offernew`;

const sysLogin = () =>
  axios
    .get(sysApiLoginURL)
    .then(response => response.data.token)
    .catch((err) => {
      throw err;
    });

const sysUnlockWallet = (token, password) =>
  axios
    .post(
      sysApiWalletpassphraseURL,
    {
      passphrase: password,
      timeout: 90,
    },
    {
      headers: {
        Token: token,
      },
    },
    )
    .then(
      response =>
        response.data === null ? { unlocked: true, token } : { unlocked: false, token: '' },
    )
    .catch((err) => {
      throw err;
    });

const sysOffernew = (token, offer) =>
  axios
    .post(sysApiOffernewURL, offer, {
      headers: {
        Token: token,
        'Content-Type': 'application/json',
      },
    })
    .then(response => response)
    .catch((err) => {
      throw err;
    });

export const sysNewOffer = (walletPwd, offer) =>
  sysLogin()
    .then((token) => {
      console.log('Syscoin Loged:', token ? 'true' : 'false');
      return sysUnlockWallet(token, walletPwd);
    })
    .then((res) => {
      console.log('Wallet Unlocked: ', res.unlocked);
      return sysOffernew(res.token, offer);
    })
    .then((res) => {
      console.log('Offer Created: ', res.data ? 'true' : 'false');
      return res.data;
    })
    .catch((err) => {
      throw err.response.data;
    });
