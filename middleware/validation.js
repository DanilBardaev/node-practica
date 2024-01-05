// Функция для проверки валидности email
function validateEmail(email) {
    
    const emailValidation = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/g;
    return emailValidation.test(email);
  }
  
  function validatePassword(password) {
    // минимум 8 символов и одна заглавная буква
    const passwordValidation = /^(?=.*[A-Z]).{8,}$/;
    return passwordValidation.test(password);
  }
  
  module.exports = {
    validateEmail,
    validatePassword
  };
  