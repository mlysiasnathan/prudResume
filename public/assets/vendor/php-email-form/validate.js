/**
* PHP Email Form Validation - v3.2
* URL: https://bootstrapmade.com/php-email-form/
* Author: BootstrapMade.com
*/
(function () {
  "use strict";

  let forms = document.querySelectorAll('.php-email-form');

  forms.forEach( function(e) {
    e.addEventListener('submit', function(event) {
      event.preventDefault();

      let thisForm = this;

      let recaptcha = thisForm.getAttribute('data-recaptcha-site-key');
      let action = "https://formsubmit.co/ajax/lyadungamigaboprudent@gmail.com";

      if( ! action ) {
        displayError(thisForm, 'The form action property is not set!')
        return;
      }
      thisForm.querySelector('.loading').classList.add('d-block');
      thisForm.querySelector('.error-message').classList.remove('d-block');
      thisForm.querySelector('.sent-message').classList.remove('d-block');
      thisForm.querySelector('.submit-btn').classList.add('d-none');

      let formData = new FormData( thisForm );

      if ( recaptcha ) {
        if(typeof grecaptcha !== "undefined" ) {
          grecaptcha.ready(function() {
            try {
              grecaptcha.execute(recaptcha, {action: 'php_email_form_submit'})
                  .then(token => {
                    formData.set('recaptcha-response', token);
                    php_email_form_submit(thisForm, action, formData);
                  })
            } catch(error) {
              displayError(thisForm, error)
            }
          });
        } else {
          displayError(thisForm, 'The reCaptcha javascript API url is not loaded!')
        }
      } else {
        php_email_form_submit(thisForm, action, formData);
      }
    });
  });

  function php_email_form_submit(thisForm, action, formData) {

    fetch(action, {
      method: "POST",
      body: JSON.stringify({
        Names: formData.get('name'),
        email: formData.get('email'),
        Subject: formData.get('subject'),
        Message: formData.get('message'),
        _captcha: true,
        _autoresponse : "Thank you Dear customer for getting in touch. I will answer very soon",
      }),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })
        .then(response => response.json())
        .then(data => {
          let msg = "This form needs Activation. We\'ve sent you an email containing an \'Activate Form\' link. Just click it and your form will be actived!"
          let msg2 = "The form was submitted successfully."
          thisForm.querySelector('.loading').classList.remove('d-block');
          if (data.success === true || data.message === msg || data.message === msg2) {
            thisForm.querySelector('.sent-message').classList.add('d-block');
            thisForm.querySelector('.submit-btn').classList.remove('d-none');
            thisForm.reset();
          } else {
            throw new Error(data ? data.message : 'Form submission failed and no error message returned from: ' + action);
          }
        })
        .catch(error => displayError(thisForm, error));
  }

  function displayError(thisForm, error) {
    thisForm.querySelector('.loading').classList.remove('d-block');
    thisForm.querySelector('.error-message').innerHTML = error;
    thisForm.querySelector('.error-message').classList.add('d-block');
    thisForm.querySelector('.submit-btn').classList.remove('d-none');
  }

})();