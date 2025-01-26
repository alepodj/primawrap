const data = {
  // Controls for all headers at the site
  headerMenus: [
    {
      name: "Today's Deal",
      href: '/search?tag=todays-deal',
    },
    {
      name: 'New Arrivals',
      href: '/search?tag=new-arrival',
    },
    {
      name: 'Featured Products',
      href: '/search?tag=featured',
    },
    {
      name: 'Best Sellers',
      href: '/search?tag=best-seller',
    },
    {
      name: 'Browsing History',
      href: '/#browsing-history',
    },
    {
      name: 'Customer Service',
      href: '/page/customer-service',
    },
    {
      name: 'About Us',
      href: '/page/about-us',
    },
    {
      name: 'Help',
      href: '/page/help',
    },
  ],

  // Controls for all banners at the site
  carousels: [
    {
      title: 'Welcome',
      buttonCaption: 'Shop',
      image: '/images/banner1.png',
      url: '/',
      isPublished: true,
    },
    {
      title: 'Best Sellers',
      buttonCaption: 'Shop Now',
      image: '/images/banner2.png',
      url: '/search?category=T-Shirts',
      isPublished: true,
    },
    {
      title: 'Best Deals',
      buttonCaption: 'Shop Now',
      image: '/images/banner3.png',
      url: '/search?category=Wrist Watches',
      isPublished: true,
    },
  ],
}

export default data
