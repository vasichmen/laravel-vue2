import { vueApp } from '@/app';
import { keyBy } from 'lodash';

/**Парсит ошибку с бэка и собирает в объект
 * {Response} error
 * @param error
 * @returns {{code:string, data:any, message:string}}
 */

export const parseError = (error) => {
  return {
    'code': error.getErrorCode(),
    'message': error.getErrorMessage(),
    'data': error.getErrorData(),
  };
};

/**
 * Установка глобальной ошибки (вывод уведомления об ошибке)
 * @param{string} error
 */
export const showGlobalError = (error) => {
  vueApp.$notify.error({
    title: 'Ошибка',
    message: error || 'Произошла ошибка',
  });

};


/**
 * Глобальный поиск ref по всему приложению
 * @param {string} refName
 * @returns {Vue|undefined}
 */
const findRef = (refName) => {
  let allRefs = {};

  const getRefs = (vueComponent) => {
    if (vueComponent.$children.length !== 0) {
      vueComponent.$children.forEach((item) => {
        getRefs(item);
      });
    }

    allRefs = {
      ...allRefs,
      ...vueComponent.$refs,
    };
  };

  getRefs(vueApp);

  return allRefs[refName];
};


/**
 * Установка ошибки в форму по имени ref
 * @param {string} formRef ref
 * @param {{
 *   code:string,
 *   message: string,
 *   data: array,
 * }} parseErrorResponse
 */
const setFormErrors = (formRef, parseErrorResponse) => {
  const form = findRef(formRef);
  if (form === undefined) {
    console.error(`Ref ${formRef} not found`);
    return;
  }

  if (parseErrorResponse.code === 'validation') {
    /** @type {array} formItems - это массив из всех дечерних элементов формы*/
    const formItems = form.fields;

    const errorsByField = keyBy(parseErrorResponse.data, 'field');
    // formElement - дочерний элемент формы. Беру его имя и сравниваю с ответом от бека
    // Если они сошлись, то записать сообщение от бека
    formItems.forEach((formElement) => {
      if (errorsByField[formElement.prop]) {

        formElement.validateMessage = errorsByField[formElement.prop].messages[0];
        formElement.validateState = 'error';
        formElement.validate();
      }
    });
  }
  else {
    showGlobalError(parseErrorResponse.message);
  }
};

/**
 * Установка ошибки в форму по имени ref из ответа с бэка
 * @param {string}formRef
 * @param {Response}errorResponse
 */
export const handleResponseError = (formRef, errorResponse) => {
  setFormErrors(formRef, parseError(errorResponse));
};
