module.exports = {
  siteMetadata: {
    title: 'usfslk blog',
    siteUrl: 'https://reactgo.com',
  },
  plugins: [
          {
        resolve: `gatsby-plugin-google-analytics`,
        options: {
          trackingId: "UA-127467388-1",
          head: true,
        },
      },
    'gatsby-plugin-react-helmet',
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'gatsby-starter-default',
        short_name: 'starter',
        start_url: '/',
        background_color: '#fff',
        theme_color: '#fff',
        display: 'minimal-ui',
        icon: 'src/images/gatsby-icon.png',
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
