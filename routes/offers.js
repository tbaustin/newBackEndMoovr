import geolib from 'geolib';

import { OfferController } from '../controllers';

import {
  sysLogin,
  sysUnlockWallet,
  sysOffernew,
  sysNewOffer
} from '../controllers/syscoin/offers';

const offerRoutes = app => {
  app.get('/API/offers', (req, res, next) => {
    OfferController.find(null, (err, results) => {
      if (err) {
        res.json(err);

        return;
      }

      const newResults = results.map((item, i) => {
        const { media, description } = JSON.parse(item.description);

        const geolocation = JSON.parse(item.geolocation);

        return {
          _id: item._id,
          offer: item.offer,
          txid: item.txid,
          expires_in: item.expires_in,
          expires_on: item.expires_on,
          expired: item.expired,
          height: item.height,
          category: item.category,
          title: item.title,
          quantity: item.quantity,
          currency: item.currency,
          sysprice: item.sysprice,
          price: item.price,
          ismine: item.ismine,
          commission: item.commission,
          offerlink: item.offerlink,
          private: item.private,
          paymentoptions: item.paymentoptions,
          paymentoptions_display: item.paymentoptions_display,
          alias_peg: item.alias_peg,
          description,
          media,
          alias: item.alias,
          address: item.address,
          alias_rating_display: item.alias_rating_display,
          offers_sold: item.offers_sold,
          geolocation,
          alias_rating_count: item.alias_rating_count,
          alias_rating: item.alias_rating,
          safetylevel: item.safetylevel,
          safesearch: item.safesearch,
          offerlink_seller: item.offerlink_seller,
          offerlink_guid: item.offerlink_guid,
          time: item.time,
          cert: item.cert,
          __v: item.__v
        };
      });

      res.json(newResults);
    });
  });

  app.get('/API/offers/sort', (req, res, next) => {
    const { type, price, title, category, pageStart, pageSize } = req.query;
    const params = {};
    const symbols = [];

    type == 'btc'
      ? symbols.push('BTC')
      : {
          ...params
        };
    type == 'sys'
      ? symbols.push('SYS')
      : {
          ...params
        };
    type == 'zec'
      ? symbols.push('ZEC')
      : {
          ...params
        };

    if ((category != 'Z-A' || 'A-Z') && category) {
      params.category = category;
    }

    params.paymentoptions_display = new RegExp(symbols.join('|'), 'i');

    OfferController.sort(params, (err, results) => {
      if (err) {
        res.json(err);
        next(err);
        return;
      }

      const newResults = results.map((item, i) => {
        const { media, description } = JSON.parse(item.description);

        const geolocation = JSON.parse(item.geolocation);

        return {
          _id: item._id,
          offer: item.offer,
          txid: item.txid,
          expires_in: item.expires_in,
          expires_on: item.expires_on,
          expired: item.expired,
          height: item.height,
          category: item.category,
          title: item.title,
          quantity: item.quantity,
          currency: item.currency,
          sysprice: item.sysprice,
          price: item.price,
          ismine: item.ismine,
          commission: item.commission,
          offerlink: item.offerlink,
          private: item.private,
          paymentoptions: item.paymentoptions,
          paymentoptions_display: item.paymentoptions_display,
          alias_peg: item.alias_peg,
          description,
          media,
          alias: item.alias,
          address: item.address,
          alias_rating_display: item.alias_rating_display,
          offers_sold: item.offers_sold,
          geolocation,
          alias_rating_count: item.alias_rating_count,
          alias_rating: item.alias_rating,
          safetylevel: item.safetylevel,
          safesearch: item.safesearch,
          offerlink_seller: item.offerlink_seller,
          offerlink_guid: item.offerlink_guid,
          time: item.time,
          cert: item.cert,
          __v: item.__v
        };
      });

      if (title === 'ascending') {
        newResults.sort((a, b) => {
          const x = a.title.toLowerCase();
          const y = b.title.toLowerCase();
          if (x < y) {
            return -1;
          }
          if (x > y) {
            return 1;
          }
          return 0;
        });
        res.json(newResults);
        return;
      }
      if (title === 'descending') {
        newResults.sort((a, b) => {
          const x = a.title.toLowerCase();
          const y = b.title.toLowerCase();
          if (x < y) {
            return 1;
          }
          if (x > y) {
            return -1;
          }
          return 0;
        });
        res.json(newResults);
        return;
      }
      if (price === 'ascending') {
        newResults.sort((a, b) => a.sysprice - b.sysprice);
        res.json(newResults);
        return;
      }

      if (price === 'descending') {
        newResults.sort((a, b) => b.sysprice - a.sysprice);
        res.json(newResults);
        return;
      }
      res.json(newResults);
    });
  });

  app.get('/API/offers/sync', (req, res, next) => {
    axios
      .get(
        'https://d2fzm6xoa70bg8.cloudfront.net/login?auth=e4031de36f45af2172fa8d0f054efcdd8d4dfd62'
      )
      .then(response => {
        axios
          .get('https://d2fzm6xoa70bg8.cloudfront.net/offerfilter?', {
            headers: {
              Token: response.data.token
            }
          })
          .then(response => {
            const { data } = response;

            const items = data.map((item, i) => {
              OfferController.findOne(
                {
                  offer: item.offer
                },
                (err, result) => {
                  if (err) {
                    return next(err);
                  }
                  if (result) {
                    return;
                  }
                  if (!result) {
                    const params = {
                      offer: item.offer,
                      cert: item.cert,
                      txid: item.txid,
                      expires_in: item.expires_in,
                      expires_on: item.expires_on,
                      expired: item.expired,
                      height: item.height,
                      time: item.time,
                      category: item.category,
                      title: item.title,
                      quantity: item.quantity,
                      currency: item.currency,
                      sysprice: item.sysprice,
                      price: item.price,
                      ismine: item.ismine,
                      commission: item.commission,
                      offerlink: item.offerlink,
                      offerlink_guid: item.offerlink_guid,
                      offerlink_seller: item.offerlink_seller,
                      private: item.private,
                      safesearch: item.safesearch,
                      safetylevel: item.safetylevel,
                      paymentoptions: item.paymentoptions,
                      paymentoptions_display: item.paymentoptions_display,
                      alias_peg: item.alias_peg,
                      description: item.description,
                      alias: item.alias,
                      address: item.address,
                      alias_rating: item.alias_rating,
                      alias_rating_count: item.alias_rating_count,
                      alias_rating_display: item.alias_rating_display,
                      geolocation: item.geolocation,
                      offers_sold: item.offers_sold
                    };
                    OfferController.create(params, (err, result) => {
                      if (err) {
                        return next(err);
                      }

                      return result;
                    });
                  }
                }
              );
            });

            res.json(items);
          })
          .catch(err => {
            console.error('err 2nd request', err);
            res.json({
              confirmation: 'fail after 2nd request',
              message: err
            });
          });
      })
      .catch(err => {
        console.error('err 1st request');
        res.json({
          confirmation: 'fail before 2nd request',
          message: err
        });
      });
  });

  app.post('/API/offers/new', (req, res, next) => {
    const walletPwd = 'password'; // this should be a calue passed in req.body

    const rawOffer = req.body;
    const offer = {
      // required fields
      alias: rawOffer.alias,
      category: rawOffer.category,
      title: rawOffer.title,
      quantity: rawOffer.quantity,
      price: rawOffer.price,
      description: JSON.stringify({
        description: rawOffer.description,
        media: rawOffer.media
      }),
      currency: rawOffer.currency,
      // optional fields
      paymentoptions: rawOffer.paymentoptions,
      private: rawOffer.private,
      geolocation: JSON.stringify(rawOffer.geolocation)
    };

    OfferController.findOne(
      {
        offer
      },
      (err, result) => {
        if (err) {
          return next(err);
        }

        if (result) {
          res.json({
            confirmation: 'fail',
            message: 'Offer already exist'
          });

          return;
        }

        if (!result) {
          const guid = '';
          sysNewOffer(walletPwd, offer)
            .then(response =>
              res.json({
                response
              })
            )
            .catch(error => {
              res.send(error);
            });
        }
      }
    );
  });

  app.put('/API/offers/edit', (req, res, next) => {
    const url =
      'https://d2fzm6xoa70bg8.cloudfront.net/login?auth=e4031de36f45af2172fa8d0f054efcdd8d4dfd62';
    axios
      .get(url)
      .then(response => {
        axios
          .post('https://d2fzm6xoa70bg8.cloudfront.net/offerupdate', req.body, {
            headers: {
              Token: response.data.token
            }
          })
          .then(response => {
            OfferController.update(
              {
                offer: response.data.offer
              },
              response.data,
              (err, result) => {
                if (err) {
                  res.json({
                    confirmation: 'fail',
                    message: err
                  });

                  return;
                }

                res.json({
                  confirmation: 'success',
                  result
                });
              }
            );
          })
          .catch(err => {
            console.error('err', err);
            res.json({
              error: err
            });
          });
      })
      .catch(err => {
        res.json({
          err
        });
      });
  });

  app.get('/API/offers/:id', (req, res, next) => {
    OfferController.findOne(
      {
        _id: req.params.id
      },
      (err, result) => {
        if (err) {
          res.json({
            confirmation: 'fail',
            message: err
          });

          return;
        }

        res.json({
          confirmation: 'success',
          result
        });
      }
    );
  });

  app.get('/API/offers/search/:id', (req, res, next) => {
    const regx = {
      $regex: req.params.id
    };

    const query = {
      $or: [
        {
          title: regx
        },
        {
          description: regx
        },
        {
          alias: regx
        }
      ]
    };

    OfferController.find(query, (err, result) => {
      if (err) {
        res.json({
          confirmation: 'fail',
          message: err
        });

        return;
      }

      res.json({
        confirmation: 'success',
        result
      });
    });
  });
};

export default offerRoutes;
