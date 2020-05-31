import { v4 as uuidv4 } from 'uuid';
import { Canvas } from './components/Canvas';
import { NotificationList } from './components/NotificationList';
import { OpenEmployeeListPanelButton } from './components/OpenEmployeeListPanelButton';
import { EmployeeListPanel } from './components/EmployeeListPanel';
import { AddEmployeePanel } from './components/AddEmployeePanel';
import { EditEmployeePanel } from './components/EditEmployeePanel';

import {
  EMPLOYEE_TRACKS,
  ZONES,
  EMPLOYEE,
} from './const';

const markOccupiedTracks = (employeeList, tracks) => {
  employeeList.forEach((employee) => {
    if (employee.trackId !== "Нет пути") {
  
      tracks.forEach((track)=> {
        if (track.id == employee.trackId) {
          track.empty = false;
        }
      });
  
    }
  });

  return tracks;
}

const renderComponent = (container, component, position = 'beforeend') => {
  switch(position) {
    case 'afterbegin': {
      container.prepend(component.getElement());
      break;
    }

    case 'beforeend': {
      container.append(component.getElement());
      break;
    }

    default: {
      throw new Error(`Unknown position given ${position}`);
    }
  }
};

export const renderApp = () => {
  const canvasContainer = document.querySelector('.display-building');
  const employeeInformationPanel = document.querySelector('.js-employee-information-panel');

  const violationsList = [
    { name: 'Миронов И.А', zone: 'Цех 1' },
    { name: 'Петухов В.П.', zone: 'Высотные работы' },
    { name: 'Лукин В.Р', zone: 'Цех 1' }
  ];
  const employeeList = JSON.parse(JSON.stringify(EMPLOYEE));
  const tracks = markOccupiedTracks(employeeList, EMPLOYEE_TRACKS);
  const zones = JSON.parse(JSON.stringify(ZONES));
  const employee = { trackId: null, permittedZones: []};
  
  const canvas = new Canvas();
  renderComponent(canvasContainer, canvas);

  const notifications = new NotificationList({ violationsList });
  notifications.hide();
  renderComponent(canvasContainer, notifications);

  const openEmployeeListPanelButton = new OpenEmployeeListPanelButton();
  openEmployeeListPanelButton.show();
  renderComponent(employeeInformationPanel, openEmployeeListPanelButton);

  const employeeListPanel = new EmployeeListPanel({ employeeList });
  employeeListPanel.hide();
  renderComponent(employeeInformationPanel, employeeListPanel);

  const addEmployeePanel = new AddEmployeePanel({ tracks, zones });
  addEmployeePanel.hide();
  renderComponent(employeeInformationPanel, addEmployeePanel);

  const editEmployeePanel = new EditEmployeePanel({employee, tracks, zones, isChecked: false});
  editEmployeePanel.hide();
  renderComponent(employeeInformationPanel, editEmployeePanel);

  //handler for open employee list button
  openEmployeeListPanelButton.setClickHandler(() => {
    openEmployeeListPanelButton.hide();
    employeeListPanel.show();
  });

  //handlers for employee list panel
  employeeListPanel.setCloseButtonHandler(() => {
    if (addEmployeePanel.isComponentShown) {
      addEmployeePanel.hide();
    }

    if (editEmployeePanel.isComponentShown) {
      editEmployeePanel.hide();
    }
    employeeListPanel.hide();
    openEmployeeListPanelButton.show();
  });

  employeeListPanel.setHandlerForAddPanelOpenButton(() => {
    if (editEmployeePanel.isComponentShown) {
      editEmployeePanel.hide();
    }

    addEmployeePanel.show();
  });

  employeeListPanel.setHandlerForEditPanelOpenButton((event) => {
    if (addEmployeePanel.isComponentShown) {
      addEmployeePanel.hide();
    }

    let pointEmployee = {};
    const employeeId = event.target.id;
    employeeList.forEach((employee) => {
      if (employee.id === employeeId) {
        pointEmployee = JSON.parse(JSON.stringify(employee));
      }
    });

    const occupiedTrack = markOccupiedTracks(employeeListPanel.getCurrentEmployeeList(), EMPLOYEE_TRACKS);
    editEmployeePanel.setState({ employee: pointEmployee, tracks: occupiedTrack });
    editEmployeePanel.show();
  })

  //handlers for add employee panel
  addEmployeePanel.setCloseButtonHandler(() => {
    addEmployeePanel.clearForm();
    addEmployeePanel.hide();
  });

  addEmployeePanel.setAddEmployeeButtonHandler((event) => {
    const nextId = uuidv4();
    const newEmployee = addEmployeePanel.getInformationOfForm(nextId);

    addEmployeePanel.clearForm();

    const previousData = employeeListPanel.data.employeeList;
    employeeListPanel.setState({ employeeList: [...previousData, newEmployee] });

    const occupiedTrack = markOccupiedTracks(employeeListPanel.data.employeeList, EMPLOYEE_TRACKS);
    addEmployeePanel.setState({ tracks: occupiedTrack, zones });

    event.preventDefault();
  });

  //handlers for edit employee panel
  editEmployeePanel.setCloseButtonHandler(() => {
    editEmployeePanel.clearForm();
    editEmployeePanel.hide();
  });
}
