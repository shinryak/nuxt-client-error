# nuxt-client-error
### Description
A module for nuxtjs that manage client-side errors in runtime. Make it easier for catching and show exception messages by binding them to component.
### How to use
#### Install
With NPM  
`npm install nuxt-client-error`  
With Yarn  
`yarn add nuxt-client-error`  
#### Add module to nuxt.config.js
Firstly, you need to add `nuxt-client-error` to your Nuxt config.
```javascript
// nuxt.config.js

{
  modules: [
    'nuxt-global-var',
    ...
  ]
}
```
#### Add an error message
You can add an error like below
```javascript
<script>
export default {
  ...
  methods:{
    awesome: function(){
      try {
        // do somethings here
      } catch (error) {
        let timeToLive = 3000
        // after 3(s), auto remove 
        // all of this error type
        this.$errors.addError('error-type', 'error-message', timeToLive)
        // If you don't want auto remove,
        // dont't set timeToLive param or set timeToLive = 0
      }
    }
  }
}
</script>
```
#### Check if error-type has any massages and show list of error messages
```html
<div v-if="$errors.hasError('error-type')">
    <p  v-for="(item, index) in $errors.getErrorMessageList('error-type')"
        :key="index">
            {{ item }}
    </p>
</div>
```
#### Remove all errors of error-type when click a button
```html
<button @click="$errors.removeError('error-type')">
        remove error
</button>
```
### Licence
[MIT License](https://github.com/minhchi3103/nuxt-client-error/blob/master/LICENSE "MIT License")
