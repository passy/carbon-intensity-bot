import * as nock from "nock";

export const nockSetups = {
  carbon_zip: () => {
    nock("https://maps.googleapis.com:443", { encodedQueryParams: true })
      .get("/maps/api/geocode/json")
      .query({
        components: "locality%3ALondon%7Cpost_code%3AWC1H%200PL",
        key: "AIzaAABBCC"
      })
      .reply(
        200,
        {
          results: [
            {
              address_components: [
                {
                  long_name: "London",
                  short_name: "London",
                  types: ["locality", "political"]
                },
                {
                  long_name: "London",
                  short_name: "London",
                  types: ["postal_town"]
                },
                {
                  long_name: "Greater London",
                  short_name: "Greater London",
                  types: ["administrative_area_level_2", "political"]
                },
                {
                  long_name: "England",
                  short_name: "England",
                  types: ["administrative_area_level_1", "political"]
                },
                {
                  long_name: "United Kingdom",
                  short_name: "GB",
                  types: ["country", "political"]
                }
              ],
              formatted_address: "London, UK",
              geometry: {
                bounds: {
                  northeast: { lat: 51.6723432, lng: 0.148271 },
                  southwest: { lat: 51.38494009999999, lng: -0.3514683 }
                },
                location: { lat: 51.5073509, lng: -0.1277583 },
                location_type: "APPROXIMATE",
                viewport: {
                  northeast: { lat: 51.6723432, lng: 0.148271 },
                  southwest: { lat: 51.38494009999999, lng: -0.3514683 }
                }
              },
              place_id: "ChIJdd4hrwug2EcRmSrV3Vo6llI",
              types: ["locality", "political"]
            }
          ],
          status: "OK"
        },
        [
          "Content-Type",
          "application/json; charset=UTF-8",
          "Date",
          "Sun, 08 Apr 2018 10:08:29 GMT",
          "Expires",
          "Mon, 09 Apr 2018 10:08:29 GMT",
          "Cache-Control",
          "public, max-age=86400",
          "Access-Control-Allow-Origin",
          "*",
          "Server",
          "mafe",
          "X-XSS-Protection",
          "1; mode=block",
          "X-Frame-Options",
          "SAMEORIGIN",
          "Alt-Svc",
          'hq=":443"; ma=2592000; quic=51303432; quic=51303431; quic=51303339; quic=51303335,quic=":443"; ma=2592000; v="42,41,39,35"',
          "Accept-Ranges",
          "none",
          "Vary",
          "Accept-Language,Accept-Encoding",
          "Connection",
          "close"
        ]
      );

    nock("https://api.co2signal.com:443", { encodedQueryParams: true })
      .get("/v1/latest")
      .query({ countryCode: "GB", "auth-token": "012345" })
      .reply(
        200,
        {
          _disclaimer:
            "This data is the exclusive property of Tomorrow and/or related parties. If you're in doubt about your rights to use this data, please contact hello@tmrow.com",
          status: "ok",
          countryCode: "GB",
          data: {
            carbonIntensity: 309.576875210522,
            fossilFuelPercentage: 57.535976307849836
          },
          units: { carbonIntensity: "gCO2eq/kWh" }
        },
        [
          "Date",
          "Sun, 08 Apr 2018 10:33:04 GMT",
          "Content-Type",
          "application/json; charset=utf-8",
          "Content-Length",
          "335",
          "Connection",
          "keep-alive",
          "Set-Cookie",
          "__cfduid=d7791835b827a87751cee8307b1a12ba31523183584; expires=Mon, 08-Apr-19 10:33:04 GMT; path=/; domain=.co2signal.com; HttpOnly",
          "X-RateLimit-Limit-second",
          "1",
          "X-RateLimit-Remaining-second",
          "0",
          "X-RateLimit-Limit-hour",
          "30",
          "X-RateLimit-Remaining-hour",
          "25",
          "X-Powered-By",
          "Express",
          "Access-Control-Allow-Origin",
          "*",
          "Access-Control-Allow-Headers",
          "Origin, X-Requested-With, Content-Type, Accept, electricitymap-token",
          "Vary",
          "Accept-Encoding",
          "X-Kong-Upstream-Latency",
          "74",
          "X-Kong-Proxy-Latency",
          "3",
          "Via",
          "kong/0.10.2",
          "Expect-CT",
          'max-age=604800, report-uri="https://report-uri.cloudflare.com/cdn-cgi/beacon/expect-ct"',
          "Server",
          "cloudflare",
          "CF-RAY",
          "408412dbc90c69f5-LHR"
        ]
      );

    nock("https://maps.googleapis.com:443", { encodedQueryParams: true })
      .get("/maps/api/geocode/json")
      .query({
        latlng: "51.5073509%2C-0.1277583",
        key: "AIzaAABBCC"
      })
      .reply(
        200,
        {
          results: [
            {
              address_components: [
                { long_name: "A4", short_name: "A4", types: ["route"] },
                {
                  long_name: "London",
                  short_name: "London",
                  types: ["locality", "political"]
                },
                {
                  long_name: "London",
                  short_name: "London",
                  types: ["postal_town"]
                },
                {
                  long_name: "Greater London",
                  short_name: "Greater London",
                  types: ["administrative_area_level_2", "political"]
                },
                {
                  long_name: "England",
                  short_name: "England",
                  types: ["administrative_area_level_1", "political"]
                },
                {
                  long_name: "United Kingdom",
                  short_name: "GB",
                  types: ["country", "political"]
                },
                {
                  long_name: "WC2N 5DU",
                  short_name: "WC2N 5DU",
                  types: ["postal_code"]
                }
              ],
              formatted_address: "A4, London WC2N 5DU, UK",
              geometry: {
                bounds: {
                  northeast: { lat: 51.5074076, lng: -0.128012 },
                  southwest: { lat: 51.507309, lng: -0.128271 }
                },
                location: { lat: 51.5073649, lng: -0.1281351 },
                location_type: "GEOMETRIC_CENTER",
                viewport: {
                  northeast: {
                    lat: 51.5087072802915,
                    lng: -0.126792519708498
                  },
                  southwest: {
                    lat: 51.5060093197085,
                    lng: -0.129490480291502
                  }
                }
              },
              place_id: "ChIJSzDdM84EdkgRgY8FbxvqCRM",
              types: ["route"]
            },
            {
              address_components: [
                {
                  long_name: "Westminster",
                  short_name: "Westminster",
                  types: ["locality", "neighborhood", "political"]
                },
                {
                  long_name: "London",
                  short_name: "London",
                  types: ["locality", "political"]
                },
                {
                  long_name: "London",
                  short_name: "London",
                  types: ["postal_town"]
                },
                {
                  long_name: "City of Westminster",
                  short_name: "City of Westminster",
                  types: ["administrative_area_level_3", "political"]
                },
                {
                  long_name: "Greater London",
                  short_name: "Greater London",
                  types: ["administrative_area_level_2", "political"]
                },
                {
                  long_name: "England",
                  short_name: "England",
                  types: ["administrative_area_level_1", "political"]
                },
                {
                  long_name: "United Kingdom",
                  short_name: "GB",
                  types: ["country", "political"]
                }
              ],
              formatted_address: "Westminster, London, UK",
              geometry: {
                bounds: {
                  northeast: { lat: 51.5073854, lng: -0.1223458 },
                  southwest: { lat: 51.48813089999999, lng: -0.1471354 }
                },
                location: { lat: 51.4974948, lng: -0.1356583 },
                location_type: "APPROXIMATE",
                viewport: {
                  northeast: { lat: 51.5073854, lng: -0.1223458 },
                  southwest: { lat: 51.48813089999999, lng: -0.1471354 }
                }
              },
              place_id: "ChIJVbSVrt0EdkgRQH_FO4ZkHc0",
              types: ["locality", "neighborhood", "political"]
            },
            {
              address_components: [
                {
                  long_name: "London",
                  short_name: "London",
                  types: ["locality", "political"]
                },
                {
                  long_name: "London",
                  short_name: "London",
                  types: ["postal_town"]
                },
                {
                  long_name: "Greater London",
                  short_name: "Greater London",
                  types: ["administrative_area_level_2", "political"]
                },
                {
                  long_name: "England",
                  short_name: "England",
                  types: ["administrative_area_level_1", "political"]
                },
                {
                  long_name: "United Kingdom",
                  short_name: "GB",
                  types: ["country", "political"]
                }
              ],
              formatted_address: "London, UK",
              geometry: {
                bounds: {
                  northeast: { lat: 51.6723432, lng: 0.148271 },
                  southwest: { lat: 51.38494009999999, lng: -0.3514683 }
                },
                location: { lat: 51.5073509, lng: -0.1277583 },
                location_type: "APPROXIMATE",
                viewport: {
                  northeast: { lat: 51.6723432, lng: 0.148271 },
                  southwest: { lat: 51.38494009999999, lng: -0.3514683 }
                }
              },
              place_id: "ChIJdd4hrwug2EcRmSrV3Vo6llI",
              types: ["locality", "political"]
            },
            {
              address_components: [
                {
                  long_name: "WC2N 5DU",
                  short_name: "WC2N 5DU",
                  types: ["postal_code"]
                },
                {
                  long_name: "Trafalgar Square",
                  short_name: "Trafalgar Square",
                  types: ["route"]
                },
                {
                  long_name: "London",
                  short_name: "London",
                  types: ["locality", "political"]
                },
                {
                  long_name: "London",
                  short_name: "London",
                  types: ["postal_town"]
                },
                {
                  long_name: "Greater London",
                  short_name: "Greater London",
                  types: ["administrative_area_level_2", "political"]
                },
                {
                  long_name: "England",
                  short_name: "England",
                  types: ["administrative_area_level_1", "political"]
                },
                {
                  long_name: "United Kingdom",
                  short_name: "GB",
                  types: ["country", "political"]
                }
              ],
              formatted_address: "Trafalgar Square, London WC2N 5DU, UK",
              geometry: {
                bounds: {
                  northeast: { lat: 51.5086097, lng: -0.1276047 },
                  southwest: { lat: 51.5069414, lng: -0.1283483 }
                },
                location: { lat: 51.5072092, lng: -0.1282941 },
                location_type: "APPROXIMATE",
                viewport: {
                  northeast: {
                    lat: 51.50912453029149,
                    lng: -0.126627519708498
                  },
                  southwest: {
                    lat: 51.50642656970849,
                    lng: -0.129325480291502
                  }
                }
              },
              place_id: "ChIJh6jmMs4EdkgR18V0MXQOdAY",
              types: ["postal_code"]
            },
            {
              address_components: [
                {
                  long_name: "WC2N",
                  short_name: "WC2N",
                  types: ["postal_code", "postal_code_prefix"]
                },
                {
                  long_name: "London",
                  short_name: "London",
                  types: ["locality", "political"]
                },
                {
                  long_name: "London",
                  short_name: "London",
                  types: ["postal_town"]
                },
                {
                  long_name: "Greater London",
                  short_name: "Greater London",
                  types: ["administrative_area_level_2", "political"]
                },
                {
                  long_name: "England",
                  short_name: "England",
                  types: ["administrative_area_level_1", "political"]
                },
                {
                  long_name: "United Kingdom",
                  short_name: "GB",
                  types: ["country", "political"]
                }
              ],
              formatted_address: "London WC2N, UK",
              geometry: {
                bounds: {
                  northeast: { lat: 51.5167991, lng: -0.1189894 },
                  southwest: { lat: 51.50410609999999, lng: -0.1294048 }
                },
                location: { lat: 51.5077151, lng: -0.1240261 },
                location_type: "APPROXIMATE",
                viewport: {
                  northeast: { lat: 51.5116811, lng: -0.1189894 },
                  southwest: { lat: 51.50410609999999, lng: -0.1294048 }
                }
              },
              place_id: "ChIJb9KHxsgEdkgRe82UfSxQIv0",
              types: ["postal_code", "postal_code_prefix"]
            },
            {
              address_components: [
                {
                  long_name: "City of Westminster",
                  short_name: "City of Westminster",
                  types: [
                    "administrative_area_level_3",
                    "locality",
                    "political"
                  ]
                },
                {
                  long_name: "London",
                  short_name: "London",
                  types: ["locality", "political"]
                },
                {
                  long_name: "London",
                  short_name: "London",
                  types: ["postal_town"]
                },
                {
                  long_name: "Greater London",
                  short_name: "Greater London",
                  types: ["administrative_area_level_2", "political"]
                },
                {
                  long_name: "England",
                  short_name: "England",
                  types: ["administrative_area_level_1", "political"]
                },
                {
                  long_name: "United Kingdom",
                  short_name: "GB",
                  types: ["country", "political"]
                }
              ],
              formatted_address: "City of Westminster, London, UK",
              geometry: {
                bounds: {
                  northeast: { lat: 51.5397932, lng: -0.1111016 },
                  southwest: { lat: 51.4838163, lng: -0.2160886 }
                },
                location: { lat: 51.5001754, lng: -0.1332326 },
                location_type: "APPROXIMATE",
                viewport: {
                  northeast: { lat: 51.5397932, lng: -0.1111016 },
                  southwest: { lat: 51.4838163, lng: -0.2160886 }
                }
              },
              place_id: "ChIJxwN8mDUFdkgRoGfsoi2uDgQ",
              types: ["administrative_area_level_3", "locality", "political"]
            },
            {
              address_components: [
                {
                  long_name: "London",
                  short_name: "London",
                  types: ["postal_town"]
                },
                {
                  long_name: "Greater London",
                  short_name: "Greater London",
                  types: ["administrative_area_level_2", "political"]
                },
                {
                  long_name: "England",
                  short_name: "England",
                  types: ["administrative_area_level_1", "political"]
                },
                {
                  long_name: "United Kingdom",
                  short_name: "GB",
                  types: ["country", "political"]
                }
              ],
              formatted_address: "London, UK",
              geometry: {
                bounds: {
                  northeast: { lat: 51.6723432, lng: 0.148271 },
                  southwest: { lat: 51.38494009999999, lng: -0.3514683 }
                },
                location: { lat: 51.5569879, lng: -0.1411791 },
                location_type: "APPROXIMATE",
                viewport: {
                  northeast: { lat: 51.6723432, lng: 0.148271 },
                  southwest: { lat: 51.38494009999999, lng: -0.3514683 }
                }
              },
              place_id: "ChIJ8_MXt1sbdkgRCrIAOXkukUk",
              types: ["postal_town"]
            },
            {
              address_components: [
                {
                  long_name: "London",
                  short_name: "London",
                  types: ["political"]
                },
                {
                  long_name: "Greater London",
                  short_name: "Greater London",
                  types: ["administrative_area_level_2", "political"]
                },
                {
                  long_name: "England",
                  short_name: "England",
                  types: ["administrative_area_level_1", "political"]
                },
                {
                  long_name: "United Kingdom",
                  short_name: "GB",
                  types: ["country", "political"]
                }
              ],
              formatted_address: "London, UK",
              geometry: {
                bounds: {
                  northeast: { lat: 51.6918241, lng: 0.3340442 },
                  southwest: { lat: 51.2867019, lng: -0.5103631 }
                },
                location: { lat: 51.4309209, lng: -0.0936496 },
                location_type: "APPROXIMATE",
                viewport: {
                  northeast: { lat: 51.6918241, lng: 0.3340442 },
                  southwest: { lat: 51.2867019, lng: -0.5103631 }
                }
              },
              place_id: "ChIJcYFfUmEDdkgR4Xf_HPV-nVc",
              types: ["political"]
            },
            {
              address_components: [
                {
                  long_name: "Greater London",
                  short_name: "Greater London",
                  types: ["administrative_area_level_2", "political"]
                },
                {
                  long_name: "England",
                  short_name: "England",
                  types: ["administrative_area_level_1", "political"]
                },
                {
                  long_name: "United Kingdom",
                  short_name: "GB",
                  types: ["country", "political"]
                }
              ],
              formatted_address: "Greater London, UK",
              geometry: {
                bounds: {
                  northeast: { lat: 51.6918726, lng: 0.3339957 },
                  southwest: { lat: 51.28676, lng: -0.5103751 }
                },
                location: { lat: 51.4309209, lng: -0.0936496 },
                location_type: "APPROXIMATE",
                viewport: {
                  northeast: { lat: 51.6918726, lng: 0.3339957 },
                  southwest: { lat: 51.28676, lng: -0.5103751 }
                }
              },
              place_id: "ChIJb-IaoQug2EcRi-m4hONz8S8",
              types: ["administrative_area_level_2", "political"]
            },
            {
              address_components: [
                {
                  long_name: "London Metropolitan Area",
                  short_name: "London Metropolitan Area",
                  types: ["political"]
                },
                {
                  long_name: "England",
                  short_name: "England",
                  types: ["administrative_area_level_1", "political"]
                },
                {
                  long_name: "United Kingdom",
                  short_name: "GB",
                  types: ["country", "political"]
                }
              ],
              formatted_address: "London Metropolitan Area, UK",
              geometry: {
                bounds: {
                  northeast: { lat: 51.8221472, lng: 0.4911679 },
                  southwest: { lat: 51.1051517, lng: -0.5392819999999999 }
                },
                location: { lat: 51.4309209, lng: -0.0936496 },
                location_type: "APPROXIMATE",
                viewport: {
                  northeast: { lat: 51.8221472, lng: 0.4911679 },
                  southwest: { lat: 51.1051517, lng: -0.5392819999999999 }
                }
              },
              place_id: "ChIJ3SIYXV0CdkgRmRTYeONPi-U",
              types: ["political"]
            },
            {
              address_components: [
                {
                  long_name: "England",
                  short_name: "England",
                  types: ["administrative_area_level_1", "political"]
                },
                {
                  long_name: "United Kingdom",
                  short_name: "GB",
                  types: ["country", "political"]
                }
              ],
              formatted_address: "England, UK",
              geometry: {
                bounds: {
                  northeast: { lat: 55.81165979999999, lng: 1.7629159 },
                  southwest: { lat: 49.8647411, lng: -6.4185458 }
                },
                location: { lat: 52.3555177, lng: -1.1743197 },
                location_type: "APPROXIMATE",
                viewport: {
                  northeast: { lat: 55.81165979999999, lng: 1.7629159 },
                  southwest: { lat: 49.8647411, lng: -6.4185458 }
                }
              },
              place_id: "ChIJ39UebIqp0EcRqI4tMyWV4fQ",
              types: ["administrative_area_level_1", "political"]
            },
            {
              address_components: [
                {
                  long_name: "United Kingdom",
                  short_name: "GB",
                  types: ["country", "political"]
                }
              ],
              formatted_address: "United Kingdom",
              geometry: {
                bounds: {
                  northeast: { lat: 60.91569999999999, lng: 33.9165549 },
                  southwest: { lat: 34.5614, lng: -8.8988999 }
                },
                location: { lat: 55.378051, lng: -3.435973 },
                location_type: "APPROXIMATE",
                viewport: {
                  northeast: { lat: 60.91569999999999, lng: 33.9165549 },
                  southwest: { lat: 34.5614, lng: -8.8988999 }
                }
              },
              place_id: "ChIJqZHHQhE7WgIReiWIMkOg-MQ",
              types: ["country", "political"]
            }
          ],
          status: "OK"
        },
        [
          "Content-Type",
          "application/json; charset=UTF-8",
          "Date",
          "Sun, 08 Apr 2018 10:34:46 GMT",
          "Expires",
          "Mon, 09 Apr 2018 10:34:46 GMT",
          "Cache-Control",
          "public, max-age=86400",
          "Access-Control-Allow-Origin",
          "*",
          "Server",
          "mafe",
          "X-XSS-Protection",
          "1; mode=block",
          "X-Frame-Options",
          "SAMEORIGIN",
          "Alt-Svc",
          'hq=":443"; ma=2592000; quic=51303432; quic=51303431; quic=51303339; quic=51303335,quic=":443"; ma=2592000; v="42,41,39,35"',
          "Accept-Ranges",
          "none",
          "Vary",
          "Accept-Language,Accept-Encoding",
          "Connection",
          "close"
        ]
      );

    nock("https://api.co2signal.com:443", { encodedQueryParams: true })
      .get("/v1/latest")
      .query({ countryCode: "GB", "auth-token": "012345" })
      .reply(
        200,
        {
          _disclaimer:
            "This data is the exclusive property of Tomorrow and/or related parties. If you're in doubt about your rights to use this data, please contact hello@tmrow.com",
          status: "ok",
          countryCode: "GB",
          data: {
            carbonIntensity: 304.99784296701154,
            fossilFuelPercentage: 57.00487986790134
          },
          units: { carbonIntensity: "gCO2eq/kWh" }
        },
        ["Content-Type", "application/json; charset=utf-8"]
      );
  },

  carbon_latlon: () => {
    nock("https://api.co2signal.com:443", { encodedQueryParams: true })
      .get("/v1/latest")
      .query({ countryCode: "GB", "auth-token": "012345" })
      .reply(
        200,
        {
          _disclaimer:
            "This data is the exclusive property of Tomorrow and/or related parties. If you're in doubt about your rights to use this data, please contact hello@tmrow.com",
          status: "ok",
          countryCode: "GB",
          data: {
            carbonIntensity: 323.2486027569276,
            fossilFuelPercentage: 60.86738754100338
          },
          units: { carbonIntensity: "gCO2eq/kWh" }
        },
        [
          "Date",
          "Sun, 08 Apr 2018 17:32:14 GMT",
          "Content-Type",
          "application/json; charset=utf-8",
          "Content-Length",
          "335",
          "Connection",
          "keep-alive",
          "Set-Cookie",
          "__cfduid=dae61d47973f6dfdc1dc44e3e73359b1d1523208734; expires=Mon, 08-Apr-19 17:32:14 GMT; path=/; domain=.co2signal.com; HttpOnly",
          "X-RateLimit-Limit-second",
          "1",
          "X-RateLimit-Remaining-second",
          "0",
          "X-RateLimit-Limit-hour",
          "30",
          "X-RateLimit-Remaining-hour",
          "29",
          "X-Powered-By",
          "Express",
          "Access-Control-Allow-Origin",
          "*",
          "Access-Control-Allow-Headers",
          "Origin, X-Requested-With, Content-Type, Accept, electricitymap-token",
          "Vary",
          "Accept-Encoding",
          "X-Kong-Upstream-Latency",
          "70",
          "X-Kong-Proxy-Latency",
          "2",
          "Via",
          "kong/0.10.2",
          "Expect-CT",
          'max-age=604800, report-uri="https://report-uri.cloudflare.com/cdn-cgi/beacon/expect-ct"',
          "Server",
          "cloudflare",
          "CF-RAY",
          "408678e03cfe0a8a-LHR"
        ]
      );

    nock("https://maps.googleapis.com:443", { encodedQueryParams: true })
      .get("/maps/api/geocode/json")
      .query({
        latlng: "51.525460599999995%2C-0.12926369999999998",
        key: "AIzaAABBCC"
      })
      .reply(
        200,
        {
          results: [
            {
              address_components: [
                { long_name: "1", short_name: "1", types: ["street_number"] },
                {
                  long_name: "Endsleigh Place",
                  short_name: "Endsleigh Pl",
                  types: ["route"]
                },
                {
                  long_name: "Kings Cross",
                  short_name: "Kings Cross",
                  types: ["neighborhood", "political"]
                },
                {
                  long_name: "London",
                  short_name: "London",
                  types: ["locality", "political"]
                },
                {
                  long_name: "London",
                  short_name: "London",
                  types: ["postal_town"]
                },
                {
                  long_name: "Greater London",
                  short_name: "Greater London",
                  types: ["administrative_area_level_2", "political"]
                },
                {
                  long_name: "England",
                  short_name: "England",
                  types: ["administrative_area_level_1", "political"]
                },
                {
                  long_name: "United Kingdom",
                  short_name: "GB",
                  types: ["country", "political"]
                },
                {
                  long_name: "WC1H 0PL",
                  short_name: "WC1H 0PL",
                  types: ["postal_code"]
                }
              ],
              formatted_address:
                "1 Endsleigh Pl, Kings Cross, London WC1H 0PL, UK",
              geometry: {
                location: { lat: 51.5256495, lng: -0.1294691 },
                location_type: "ROOFTOP",
                viewport: {
                  northeast: { lat: 51.5269984802915, lng: -0.128120119708498 },
                  southwest: { lat: 51.5243005197085, lng: -0.130818080291502 }
                }
              },
              place_id: "ChIJQ-BQVCUbdkgRJSl1sYnENSs",
              types: ["street_address"]
            },
            {
              address_components: [
                {
                  long_name: "Woburn House",
                  short_name: "Woburn House",
                  types: ["premise"]
                },
                {
                  long_name: "Kings Cross",
                  short_name: "Kings Cross",
                  types: ["neighborhood", "political"]
                },
                {
                  long_name: "London",
                  short_name: "London",
                  types: ["locality", "political"]
                },
                {
                  long_name: "London",
                  short_name: "London",
                  types: ["postal_town"]
                },
                {
                  long_name: "Greater London",
                  short_name: "Greater London",
                  types: ["administrative_area_level_2", "political"]
                },
                {
                  long_name: "England",
                  short_name: "England",
                  types: ["administrative_area_level_1", "political"]
                },
                {
                  long_name: "United Kingdom",
                  short_name: "GB",
                  types: ["country", "political"]
                },
                {
                  long_name: "WC1H",
                  short_name: "WC1H",
                  types: ["postal_code", "postal_code_prefix"]
                }
              ],
              formatted_address: "Woburn House, Kings Cross, London WC1H, UK",
              geometry: {
                location: { lat: 51.5257887, lng: -0.1295745 },
                location_type: "ROOFTOP",
                viewport: {
                  northeast: { lat: 51.5271376802915, lng: -0.128225519708498 },
                  southwest: { lat: 51.5244397197085, lng: -0.130923480291502 }
                }
              },
              place_id: "ChIJBYlEUSUbdkgRFvbpC43KulY",
              types: ["premise"]
            },
            {
              address_components: [
                {
                  long_name: "Winston House",
                  short_name: "Winston House",
                  types: ["premise"]
                },
                { long_name: "7", short_name: "7", types: ["street_number"] },
                {
                  long_name: "Endsleigh Street",
                  short_name: "Endsleigh St",
                  types: ["route"]
                },
                {
                  long_name: "Kings Cross",
                  short_name: "Kings Cross",
                  types: ["neighborhood", "political"]
                },
                {
                  long_name: "London",
                  short_name: "London",
                  types: ["locality", "political"]
                },
                {
                  long_name: "London",
                  short_name: "London",
                  types: ["postal_town"]
                },
                {
                  long_name: "Greater London",
                  short_name: "Greater London",
                  types: ["administrative_area_level_2", "political"]
                },
                {
                  long_name: "England",
                  short_name: "England",
                  types: ["administrative_area_level_1", "political"]
                },
                {
                  long_name: "United Kingdom",
                  short_name: "GB",
                  types: ["country", "political"]
                },
                {
                  long_name: "WC1H 0EA",
                  short_name: "WC1H 0EA",
                  types: ["postal_code"]
                }
              ],
              formatted_address:
                "Winston House, 7 Endsleigh St, Kings Cross, London WC1H 0EA, UK",
              geometry: {
                location: { lat: 51.5257511, lng: -0.1305719 },
                location_type: "ROOFTOP",
                viewport: {
                  northeast: { lat: 51.5271000802915, lng: -0.129222919708498 },
                  southwest: { lat: 51.5244021197085, lng: -0.131920880291502 }
                }
              },
              place_id: "ChIJz7l7XiUbdkgRb6teNZeLkAQ",
              types: ["premise"]
            },
            {
              address_components: [
                {
                  long_name: "Bloomsbury",
                  short_name: "Bloomsbury",
                  types: ["neighborhood", "political"]
                },
                {
                  long_name: "London",
                  short_name: "London",
                  types: ["locality", "political"]
                },
                {
                  long_name: "London",
                  short_name: "London",
                  types: ["postal_town"]
                },
                {
                  long_name: "London Borough of Camden",
                  short_name: "London Borough of Camden",
                  types: ["administrative_area_level_3", "political"]
                },
                {
                  long_name: "Greater London",
                  short_name: "Greater London",
                  types: ["administrative_area_level_2", "political"]
                },
                {
                  long_name: "England",
                  short_name: "England",
                  types: ["administrative_area_level_1", "political"]
                },
                {
                  long_name: "United Kingdom",
                  short_name: "GB",
                  types: ["country", "political"]
                }
              ],
              formatted_address: "Bloomsbury, London, UK",
              geometry: {
                bounds: {
                  northeast: { lat: 51.5274735, lng: -0.1202453 },
                  southwest: { lat: 51.516623, lng: -0.1419157 }
                },
                location: { lat: 51.5218962, lng: -0.1279597 },
                location_type: "APPROXIMATE",
                viewport: {
                  northeast: { lat: 51.5274735, lng: -0.1202453 },
                  southwest: { lat: 51.516623, lng: -0.1419157 }
                }
              },
              place_id: "ChIJweU0JC4bdkgR0_XApfwHFCs",
              types: ["neighborhood", "political"]
            },
            {
              address_components: [
                {
                  long_name: "London",
                  short_name: "London",
                  types: ["locality", "political"]
                },
                {
                  long_name: "London",
                  short_name: "London",
                  types: ["postal_town"]
                },
                {
                  long_name: "Greater London",
                  short_name: "Greater London",
                  types: ["administrative_area_level_2", "political"]
                },
                {
                  long_name: "England",
                  short_name: "England",
                  types: ["administrative_area_level_1", "political"]
                },
                {
                  long_name: "United Kingdom",
                  short_name: "GB",
                  types: ["country", "political"]
                }
              ],
              formatted_address: "London, UK",
              geometry: {
                bounds: {
                  northeast: { lat: 51.6723432, lng: 0.148271 },
                  southwest: { lat: 51.38494009999999, lng: -0.3514683 }
                },
                location: { lat: 51.5073509, lng: -0.1277583 },
                location_type: "APPROXIMATE",
                viewport: {
                  northeast: { lat: 51.6723432, lng: 0.148271 },
                  southwest: { lat: 51.38494009999999, lng: -0.3514683 }
                }
              },
              place_id: "ChIJdd4hrwug2EcRmSrV3Vo6llI",
              types: ["locality", "political"]
            },
            {
              address_components: [
                {
                  long_name: "WC1H 9HU",
                  short_name: "WC1H 9HU",
                  types: ["postal_code"]
                },
                {
                  long_name: "Tavistock Square",
                  short_name: "Tavistock Square",
                  types: ["route"]
                },
                {
                  long_name: "Bloomsbury",
                  short_name: "Bloomsbury",
                  types: ["neighborhood", "political"]
                },
                {
                  long_name: "London",
                  short_name: "London",
                  types: ["locality", "political"]
                },
                {
                  long_name: "London",
                  short_name: "London",
                  types: ["postal_town"]
                },
                {
                  long_name: "Greater London",
                  short_name: "Greater London",
                  types: ["administrative_area_level_2", "political"]
                },
                {
                  long_name: "England",
                  short_name: "England",
                  types: ["administrative_area_level_1", "political"]
                },
                {
                  long_name: "United Kingdom",
                  short_name: "GB",
                  types: ["country", "political"]
                }
              ],
              formatted_address:
                "Tavistock Square, Bloomsbury, London WC1H 9HU, UK",
              geometry: {
                bounds: {
                  northeast: { lat: 51.5260514, lng: -0.1292136 },
                  southwest: { lat: 51.5253102, lng: -0.1299539 }
                },
                location: { lat: 51.5258368, lng: -0.1296783 },
                location_type: "APPROXIMATE",
                viewport: {
                  northeast: { lat: 51.5270297802915, lng: -0.128234769708498 },
                  southwest: { lat: 51.5243318197085, lng: -0.130932730291502 }
                }
              },
              place_id: "ChIJTd1SUSUbdkgRAr9kXdj3-BI",
              types: ["postal_code"]
            },
            {
              address_components: [
                {
                  long_name: "WC1H 9HF",
                  short_name: "WC1H 9HF",
                  types: ["postal_code"]
                },
                {
                  long_name: "Bloomsbury",
                  short_name: "Bloomsbury",
                  types: ["neighborhood", "political"]
                },
                {
                  long_name: "London",
                  short_name: "London",
                  types: ["locality", "political"]
                },
                {
                  long_name: "London",
                  short_name: "London",
                  types: ["postal_town"]
                },
                {
                  long_name: "Greater London",
                  short_name: "Greater London",
                  types: ["administrative_area_level_2", "political"]
                },
                {
                  long_name: "England",
                  short_name: "England",
                  types: ["administrative_area_level_1", "political"]
                },
                {
                  long_name: "United Kingdom",
                  short_name: "GB",
                  types: ["country", "political"]
                }
              ],
              formatted_address: "Bloomsbury, London WC1H 9HF, UK",
              geometry: {
                bounds: {
                  northeast: { lat: 51.5260514, lng: -0.1292136 },
                  southwest: { lat: 51.5253102, lng: -0.1299539 }
                },
                location: { lat: 51.5258368, lng: -0.1296783 },
                location_type: "APPROXIMATE",
                viewport: {
                  northeast: { lat: 51.5270297802915, lng: -0.128234769708498 },
                  southwest: { lat: 51.5243318197085, lng: -0.130932730291502 }
                }
              },
              place_id: "ChIJTd1SUSUbdkgRV55ZKl8wS1Y",
              types: ["postal_code"]
            },
            {
              address_components: [
                {
                  long_name: "WC1H 9HW",
                  short_name: "WC1H 9HW",
                  types: ["postal_code"]
                },
                {
                  long_name: "Tavistock Square",
                  short_name: "Tavistock Square",
                  types: ["route"]
                },
                {
                  long_name: "Bloomsbury",
                  short_name: "Bloomsbury",
                  types: ["neighborhood", "political"]
                },
                {
                  long_name: "London",
                  short_name: "London",
                  types: ["locality", "political"]
                },
                {
                  long_name: "London",
                  short_name: "London",
                  types: ["postal_town"]
                },
                {
                  long_name: "Greater London",
                  short_name: "Greater London",
                  types: ["administrative_area_level_2", "political"]
                },
                {
                  long_name: "England",
                  short_name: "England",
                  types: ["administrative_area_level_1", "political"]
                },
                {
                  long_name: "United Kingdom",
                  short_name: "GB",
                  types: ["country", "political"]
                }
              ],
              formatted_address:
                "Tavistock Square, Bloomsbury, London WC1H 9HW, UK",
              geometry: {
                bounds: {
                  northeast: { lat: 51.5260514, lng: -0.1292136 },
                  southwest: { lat: 51.5253102, lng: -0.1299539 }
                },
                location: { lat: 51.5258368, lng: -0.1296783 },
                location_type: "APPROXIMATE",
                viewport: {
                  northeast: { lat: 51.5270297802915, lng: -0.128234769708498 },
                  southwest: { lat: 51.5243318197085, lng: -0.130932730291502 }
                }
              },
              place_id: "ChIJTd1SUSUbdkgRkpZdhrZSdf0",
              types: ["postal_code"]
            },
            {
              address_components: [
                {
                  long_name: "WC1H 9HB",
                  short_name: "WC1H 9HB",
                  types: ["postal_code"]
                },
                {
                  long_name: "Tavistock Square",
                  short_name: "Tavistock Square",
                  types: ["route"]
                },
                {
                  long_name: "Bloomsbury",
                  short_name: "Bloomsbury",
                  types: ["neighborhood", "political"]
                },
                {
                  long_name: "London",
                  short_name: "London",
                  types: ["locality", "political"]
                },
                {
                  long_name: "London",
                  short_name: "London",
                  types: ["postal_town"]
                },
                {
                  long_name: "Greater London",
                  short_name: "Greater London",
                  types: ["administrative_area_level_2", "political"]
                },
                {
                  long_name: "England",
                  short_name: "England",
                  types: ["administrative_area_level_1", "political"]
                },
                {
                  long_name: "United Kingdom",
                  short_name: "GB",
                  types: ["country", "political"]
                }
              ],
              formatted_address:
                "Tavistock Square, Bloomsbury, London WC1H 9HB, UK",
              geometry: {
                bounds: {
                  northeast: { lat: 51.5260514, lng: -0.1292136 },
                  southwest: { lat: 51.5253102, lng: -0.1299539 }
                },
                location: { lat: 51.5258368, lng: -0.1296783 },
                location_type: "APPROXIMATE",
                viewport: {
                  northeast: { lat: 51.5270297802915, lng: -0.128234769708498 },
                  southwest: { lat: 51.5243318197085, lng: -0.130932730291502 }
                }
              },
              place_id: "ChIJTd1SUSUbdkgReYutaHsf-mQ",
              types: ["postal_code"]
            },
            {
              address_components: [
                {
                  long_name: "WC1H 9HD",
                  short_name: "WC1H 9HD",
                  types: ["postal_code"]
                },
                {
                  long_name: "Bloomsbury",
                  short_name: "Bloomsbury",
                  types: ["neighborhood", "political"]
                },
                {
                  long_name: "London",
                  short_name: "London",
                  types: ["locality", "political"]
                },
                {
                  long_name: "London",
                  short_name: "London",
                  types: ["postal_town"]
                },
                {
                  long_name: "Greater London",
                  short_name: "Greater London",
                  types: ["administrative_area_level_2", "political"]
                },
                {
                  long_name: "England",
                  short_name: "England",
                  types: ["administrative_area_level_1", "political"]
                },
                {
                  long_name: "United Kingdom",
                  short_name: "GB",
                  types: ["country", "political"]
                }
              ],
              formatted_address: "Bloomsbury, London WC1H 9HD, UK",
              geometry: {
                bounds: {
                  northeast: { lat: 51.5260514, lng: -0.1292136 },
                  southwest: { lat: 51.5253102, lng: -0.1299539 }
                },
                location: { lat: 51.5258368, lng: -0.1296783 },
                location_type: "APPROXIMATE",
                viewport: {
                  northeast: { lat: 51.5270297802915, lng: -0.128234769708498 },
                  southwest: { lat: 51.5243318197085, lng: -0.130932730291502 }
                }
              },
              place_id: "ChIJTd1SUSUbdkgRoBx9-jq7RzI",
              types: ["postal_code"]
            },
            {
              address_components: [
                {
                  long_name: "WC1H 9HQ",
                  short_name: "WC1H 9HQ",
                  types: ["postal_code"]
                },
                {
                  long_name: "Bloomsbury",
                  short_name: "Bloomsbury",
                  types: ["neighborhood", "political"]
                },
                {
                  long_name: "London",
                  short_name: "London",
                  types: ["locality", "political"]
                },
                {
                  long_name: "London",
                  short_name: "London",
                  types: ["postal_town"]
                },
                {
                  long_name: "Greater London",
                  short_name: "Greater London",
                  types: ["administrative_area_level_2", "political"]
                },
                {
                  long_name: "England",
                  short_name: "England",
                  types: ["administrative_area_level_1", "political"]
                },
                {
                  long_name: "United Kingdom",
                  short_name: "GB",
                  types: ["country", "political"]
                }
              ],
              formatted_address: "Bloomsbury, London WC1H 9HQ, UK",
              geometry: {
                bounds: {
                  northeast: { lat: 51.5260514, lng: -0.1292136 },
                  southwest: { lat: 51.5253102, lng: -0.1299539 }
                },
                location: { lat: 51.5258368, lng: -0.1296783 },
                location_type: "APPROXIMATE",
                viewport: {
                  northeast: { lat: 51.5270297802915, lng: -0.128234769708498 },
                  southwest: { lat: 51.5243318197085, lng: -0.130932730291502 }
                }
              },
              place_id: "ChIJTd1SUSUbdkgRWwijGHBR8i4",
              types: ["postal_code"]
            },
            {
              address_components: [
                {
                  long_name: "WC1H",
                  short_name: "WC1H",
                  types: ["postal_code", "postal_code_prefix"]
                },
                {
                  long_name: "London",
                  short_name: "London",
                  types: ["locality", "political"]
                },
                {
                  long_name: "London",
                  short_name: "London",
                  types: ["postal_town"]
                },
                {
                  long_name: "Greater London",
                  short_name: "Greater London",
                  types: ["administrative_area_level_2", "political"]
                },
                {
                  long_name: "England",
                  short_name: "England",
                  types: ["administrative_area_level_1", "political"]
                },
                {
                  long_name: "United Kingdom",
                  short_name: "GB",
                  types: ["country", "political"]
                }
              ],
              formatted_address: "London WC1H, UK",
              geometry: {
                bounds: {
                  northeast: { lat: 51.5305268, lng: -0.1184728 },
                  southwest: { lat: 51.515938, lng: -0.1340607 }
                },
                location: { lat: 51.5274243, lng: -0.1270552 },
                location_type: "APPROXIMATE",
                viewport: {
                  northeast: { lat: 51.5305268, lng: -0.1184728 },
                  southwest: { lat: 51.5217683, lng: -0.1340607 }
                }
              },
              place_id: "ChIJM_bCQCUbdkgRbZ3bexVVEgs",
              types: ["postal_code", "postal_code_prefix"]
            },
            {
              address_components: [
                {
                  long_name: "London Borough of Camden",
                  short_name: "London Borough of Camden",
                  types: ["administrative_area_level_3", "political"]
                },
                {
                  long_name: "London",
                  short_name: "London",
                  types: ["locality", "political"]
                },
                {
                  long_name: "London",
                  short_name: "London",
                  types: ["postal_town"]
                },
                {
                  long_name: "Greater London",
                  short_name: "Greater London",
                  types: ["administrative_area_level_2", "political"]
                },
                {
                  long_name: "England",
                  short_name: "England",
                  types: ["administrative_area_level_1", "political"]
                },
                {
                  long_name: "United Kingdom",
                  short_name: "GB",
                  types: ["country", "political"]
                }
              ],
              formatted_address: "London Borough of Camden, London, UK",
              geometry: {
                bounds: {
                  northeast: { lat: 51.5729787, lng: -0.1053499 },
                  southwest: { lat: 51.5126521, lng: -0.2135012 }
                },
                location: { lat: 51.55170589999999, lng: -0.1588255 },
                location_type: "APPROXIMATE",
                viewport: {
                  northeast: { lat: 51.5729787, lng: -0.1053499 },
                  southwest: { lat: 51.5126521, lng: -0.2135012 }
                }
              },
              place_id: "ChIJPZprGOwadkgR4Ga-JsaFEQQ",
              types: ["administrative_area_level_3", "political"]
            },
            {
              address_components: [
                {
                  long_name: "London",
                  short_name: "London",
                  types: ["postal_town"]
                },
                {
                  long_name: "Greater London",
                  short_name: "Greater London",
                  types: ["administrative_area_level_2", "political"]
                },
                {
                  long_name: "England",
                  short_name: "England",
                  types: ["administrative_area_level_1", "political"]
                },
                {
                  long_name: "United Kingdom",
                  short_name: "GB",
                  types: ["country", "political"]
                }
              ],
              formatted_address: "London, UK",
              geometry: {
                bounds: {
                  northeast: { lat: 51.6723432, lng: 0.148271 },
                  southwest: { lat: 51.38494009999999, lng: -0.3514683 }
                },
                location: { lat: 51.5569879, lng: -0.1411791 },
                location_type: "APPROXIMATE",
                viewport: {
                  northeast: { lat: 51.6723432, lng: 0.148271 },
                  southwest: { lat: 51.38494009999999, lng: -0.3514683 }
                }
              },
              place_id: "ChIJ8_MXt1sbdkgRCrIAOXkukUk",
              types: ["postal_town"]
            },
            {
              address_components: [
                {
                  long_name: "London",
                  short_name: "London",
                  types: ["political"]
                },
                {
                  long_name: "Greater London",
                  short_name: "Greater London",
                  types: ["administrative_area_level_2", "political"]
                },
                {
                  long_name: "England",
                  short_name: "England",
                  types: ["administrative_area_level_1", "political"]
                },
                {
                  long_name: "United Kingdom",
                  short_name: "GB",
                  types: ["country", "political"]
                }
              ],
              formatted_address: "London, UK",
              geometry: {
                bounds: {
                  northeast: { lat: 51.6918241, lng: 0.3340442 },
                  southwest: { lat: 51.2867019, lng: -0.5103631 }
                },
                location: { lat: 51.4309209, lng: -0.0936496 },
                location_type: "APPROXIMATE",
                viewport: {
                  northeast: { lat: 51.6918241, lng: 0.3340442 },
                  southwest: { lat: 51.2867019, lng: -0.5103631 }
                }
              },
              place_id: "ChIJcYFfUmEDdkgR4Xf_HPV-nVc",
              types: ["political"]
            },
            {
              address_components: [
                {
                  long_name: "Greater London",
                  short_name: "Greater London",
                  types: ["administrative_area_level_2", "political"]
                },
                {
                  long_name: "England",
                  short_name: "England",
                  types: ["administrative_area_level_1", "political"]
                },
                {
                  long_name: "United Kingdom",
                  short_name: "GB",
                  types: ["country", "political"]
                }
              ],
              formatted_address: "Greater London, UK",
              geometry: {
                bounds: {
                  northeast: { lat: 51.6918726, lng: 0.3339957 },
                  southwest: { lat: 51.28676, lng: -0.5103751 }
                },
                location: { lat: 51.4309209, lng: -0.0936496 },
                location_type: "APPROXIMATE",
                viewport: {
                  northeast: { lat: 51.6918726, lng: 0.3339957 },
                  southwest: { lat: 51.28676, lng: -0.5103751 }
                }
              },
              place_id: "ChIJb-IaoQug2EcRi-m4hONz8S8",
              types: ["administrative_area_level_2", "political"]
            },
            {
              address_components: [
                {
                  long_name: "London Metropolitan Area",
                  short_name: "London Metropolitan Area",
                  types: ["political"]
                },
                {
                  long_name: "England",
                  short_name: "England",
                  types: ["administrative_area_level_1", "political"]
                },
                {
                  long_name: "United Kingdom",
                  short_name: "GB",
                  types: ["country", "political"]
                }
              ],
              formatted_address: "London Metropolitan Area, UK",
              geometry: {
                bounds: {
                  northeast: { lat: 51.8221472, lng: 0.4911679 },
                  southwest: { lat: 51.1051517, lng: -0.5392819999999999 }
                },
                location: { lat: 51.4309209, lng: -0.0936496 },
                location_type: "APPROXIMATE",
                viewport: {
                  northeast: { lat: 51.8221472, lng: 0.4911679 },
                  southwest: { lat: 51.1051517, lng: -0.5392819999999999 }
                }
              },
              place_id: "ChIJ3SIYXV0CdkgRmRTYeONPi-U",
              types: ["political"]
            },
            {
              address_components: [
                {
                  long_name: "England",
                  short_name: "England",
                  types: ["administrative_area_level_1", "political"]
                },
                {
                  long_name: "United Kingdom",
                  short_name: "GB",
                  types: ["country", "political"]
                }
              ],
              formatted_address: "England, UK",
              geometry: {
                bounds: {
                  northeast: { lat: 55.81165979999999, lng: 1.7629159 },
                  southwest: { lat: 49.8647411, lng: -6.4185458 }
                },
                location: { lat: 52.3555177, lng: -1.1743197 },
                location_type: "APPROXIMATE",
                viewport: {
                  northeast: { lat: 55.81165979999999, lng: 1.7629159 },
                  southwest: { lat: 49.8647411, lng: -6.4185458 }
                }
              },
              place_id: "ChIJ39UebIqp0EcRqI4tMyWV4fQ",
              types: ["administrative_area_level_1", "political"]
            },
            {
              address_components: [
                {
                  long_name: "United Kingdom",
                  short_name: "GB",
                  types: ["country", "political"]
                }
              ],
              formatted_address: "United Kingdom",
              geometry: {
                bounds: {
                  northeast: { lat: 60.91569999999999, lng: 33.9165549 },
                  southwest: { lat: 34.5614, lng: -8.8988999 }
                },
                location: { lat: 55.378051, lng: -3.435973 },
                location_type: "APPROXIMATE",
                viewport: {
                  northeast: { lat: 60.91569999999999, lng: 33.9165549 },
                  southwest: { lat: 34.5614, lng: -8.8988999 }
                }
              },
              place_id: "ChIJqZHHQhE7WgIReiWIMkOg-MQ",
              types: ["country", "political"]
            }
          ],
          status: "OK"
        },
        [
          "Content-Type",
          "application/json; charset=UTF-8",
          "Date",
          "Sun, 08 Apr 2018 17:32:14 GMT",
          "Expires",
          "Mon, 09 Apr 2018 17:32:14 GMT",
          "Cache-Control",
          "public, max-age=86400",
          "Access-Control-Allow-Origin",
          "*",
          "Server",
          "mafe",
          "X-XSS-Protection",
          "1; mode=block",
          "X-Frame-Options",
          "SAMEORIGIN",
          "Alt-Svc",
          'hq=":443"; ma=2592000; quic=51303432; quic=51303431; quic=51303339; quic=51303335,quic=":443"; ma=2592000; v="42,41,39,35"',
          "Accept-Ranges",
          "none",
          "Vary",
          "Accept-Language,Accept-Encoding",
          "Connection",
          "close"
        ]
      );
  },

  carbon_userstorage: () => {
    nock("https://api.co2signal.com:443", { encodedQueryParams: true })
      .get("/v1/latest")
      .query({ countryCode: "GB", "auth-token": "012345" })
      .reply(
        200,
        {
          _disclaimer:
            "This data is the exclusive property of Tomorrow and/or related parties. If you're in doubt about your rights to use this data, please contact hello@tmrow.com",
          status: "ok",
          countryCode: "GB",
          data: {
            carbonIntensity: 323.2486027569276,
            fossilFuelPercentage: 60.86738754100338
          },
          units: { carbonIntensity: "gCO2eq/kWh" }
        },
        [
          "Date",
          "Sun, 08 Apr 2018 17:35:08 GMT",
          "Content-Type",
          "application/json; charset=utf-8",
          "Content-Length",
          "335",
          "Connection",
          "keep-alive",
          "Set-Cookie",
          "__cfduid=d096f21869824b32f7230651cbbba51851523208908; expires=Mon, 08-Apr-19 17:35:08 GMT; path=/; domain=.co2signal.com; HttpOnly",
          "X-RateLimit-Limit-second",
          "1",
          "X-RateLimit-Remaining-second",
          "0",
          "X-RateLimit-Limit-hour",
          "30",
          "X-RateLimit-Remaining-hour",
          "27",
          "X-Powered-By",
          "Express",
          "Access-Control-Allow-Origin",
          "*",
          "Access-Control-Allow-Headers",
          "Origin, X-Requested-With, Content-Type, Accept, electricitymap-token",
          "Vary",
          "Accept-Encoding",
          "X-Kong-Upstream-Latency",
          "65",
          "X-Kong-Proxy-Latency",
          "2",
          "Via",
          "kong/0.10.2",
          "Expect-CT",
          'max-age=604800, report-uri="https://report-uri.cloudflare.com/cdn-cgi/beacon/expect-ct"'
        ]
      );
  }
};
