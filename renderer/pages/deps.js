let localStorage;
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}
const fromStorage = JSON.parse(localStorage.getItem('deps'))

export function SettingStoragedValue(e) {
  try {
    const fromStorage = JSON.parse(localStorage.getItem('deps'))
    const Ite = fromStorage.map(item => {
      return item.t === e ? item.installed : null
    })
    const fr = Ite.filter(Boolean)
    return fr.toString()
  } catch (error) {
    return null
  }
}

export var depsList = [
  {
    t: 1,
    installed: fromStorage ? SettingStoragedValue(1) : false,
  },
  {
    t: 2,
    installed: fromStorage ? SettingStoragedValue(2) : false,
  },

]
