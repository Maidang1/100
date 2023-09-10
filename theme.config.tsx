import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'


type ss = keyof DocsThemeConfig;

const config: DocsThemeConfig = {
  logo: <span>100</span>,
  // project: {
  //   link: 'https://github.com/shuding/nextra-docs-template',
  // },
  // chat: {
  //   link: 'https://discord.com',
  // },
  // docsRepositoryBase: 'https://github.com/shuding/nextra-docs-template',
  // footer: {
  //   text: 'Nextra Docs Template',
  // },
  editLink:{
    text: 'Edit this page on GitHub',
    component: (props:{
      children: any;
      className?: string | undefined;
      filePath?: string | undefined;
  })=>{
    return null
  }
  },
  feedback:{
    content: null
  },
  footer:{
    text: "MIT 2023 © Maidang1. Powered by Nextra"
  },
  // head: <div>100</div>
}

export default config
