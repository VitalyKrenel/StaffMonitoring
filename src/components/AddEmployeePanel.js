import { Component } from './Component';
import { createTemplateForCloseButton } from './CloseButton';
import { createEmployeeEntity } from '../Core/entity/EmployeeEntity';

const createTemplateForTrackOption = (track) => `
<option value="${track.id}">${track.name}</option>
`;

const createTemplateForZoneCheckbox = (zone) => `
<div>
  <input name="employeeZones" type="checkbox" value="${zone.id}" id="${zone.id}">
  <label for="${zone.id}">${zone.name}</label>
</div>
`;

const createAddEmployeePanelTemplate = ({ tracks, zones }) => {
  const trackList = tracks.filter(track => {
    if (!track.isOccupied) {
      return track;
    }
  }).map(createTemplateForTrackOption);
  
  const zonesList = zones.map((zone) => createTemplateForZoneCheckbox(zone)).join('');

  return `
  <div class="employee-add-panel">
    <header class="employee-add-panel__header">
      ${createTemplateForCloseButton()}
    </header>

    <div class="employee-add-panel__body">

    <form id="add-form" class="employee-add-panel__form add-employee-form" action="" name="add-emp" method="GET">

    <div class="add-employee-form__name add-name-container">
      <label class="add-name-container__label" for="add-name">ФИО:<span class="required-field">*</span></label>
      <input name="employeeName" class="add-name-container__input" type="text" id="add-name" placeholder="Иванов И.И." title="Введите ФИО сотрудника"
        autofocus
        required>
    </div>

    <div class="add-employee-form__position add-position-container">
      <label class="add-position-container__label" for="add-position">Должность:<span class="required-field">*</span></label>
      <input name="employeePosition" class="add-position-container__input" type="text" id="add-position" placeholder="Техник" title="Введите должность сотрудника"
        required>
    </div>

    <div class="add-employee-form__track add-track-container">
      <label class="add-track-container__label" for="add-track">Путь:</label>
      <select name="employeeTrack" class="add-track-container__select" id="add-track">
        <option class="js-add-tracks" value="">Нет пути</option>
        ${trackList}
      </select>
    </div>

    <label>Доступные зоны:</label>
    <div class="add-employee-form__zone">
      <div class="add-zone-container">
        ${zonesList}
      </div>
    </div>

    <footer class="employee-add-panel__footer footer-add">
      <button type="submit" class="footer-add__button-add-employee js-button-add-employee" title="Добавить работника">Добавить сотрудника</button>
    </footer>
    </div>
    </form>
  </div>
`;
}

export class AddEmployeePanel extends Component {
  getTemplate() {
    return createAddEmployeePanelTemplate(this.data);
  }

  setCloseButtonHandler(handler) {
    this.closeButtonHandler = handler;

    this.getElement().querySelector('.js-btn-close').addEventListener('click', handler);
  }

  setAddEmployeeButtonHandler(handler) {
    this.addEmployeeButtonHandler = handler;

    const form = this.getForm();
    form.addEventListener('submit', handler);
  }

  getForm() {
    return this.getElement().querySelector('#add-form');
  }

  getNewEmployee() {
    const form = this.getForm();

    const zoneCheckboxes = Array.from(form.elements.employeeZones);
    const permittedZoneIds = zoneCheckboxes.filter(zoneCheckbox => zoneCheckbox.checked).map(zoneCheckbox => Number(zoneCheckbox.id));
    const trackId = Number(form.employeeTrack.value);

    return createEmployeeEntity({
      trackId: trackId ? trackId : null,
      name: form.employeeName.value,
      position: form.employeePosition.value,
      permittedZoneIds: permittedZoneIds,
    });
  }

  clearForm() {
    const form = this.getForm();
    form.reset();
  }

  recoveryEventListeners() {
    this.setCloseButtonHandler(this.closeButtonHandler);
    this.setAddEmployeeButtonHandler(this.addEmployeeButtonHandler);
  }
}
