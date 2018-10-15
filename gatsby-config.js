module.exports = {
  siteMetadata: {
    title: 'Protobulb.io Blog',
    siteUrl: 'https://reactgo.com',
  },
  plugins: [
          {
        resolve: `gatsby-plugin-google-analytics`,
        options: {
          trackingId: "UA-127467388-1",
          head: false,
        },
      },
    'gatsby-plugin-react-helmet',
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'protobulb-journal',
        short_name: 'protobulb-journal',
        start_url: '/',
        background_color: '#fff',
        theme_color: '#fff',
        display: 'minimal-ui',
        icon: 'src/images/logo.png',
      },
    },

    `gatsby-transformer-remark`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    'gatsby-plugin-offline',
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          `gatsby-remark-prismjs`,
        ]
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/pages`,
        name: "pages",
      },
    },
  ],
}
