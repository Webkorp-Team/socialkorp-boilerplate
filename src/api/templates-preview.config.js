
export default {
  homepage:{
    header: require('templates/home/Header').default,
    // content: require('templates/home/Content').default,
  },
  terms:{
    header: require('templates/terms-and-conditions/Header').default,
    content: require('templates/terms-and-conditions/Content').default,
  },
  common:{
    footer: require('components/Footer').default
  }
};
