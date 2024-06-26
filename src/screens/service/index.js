// src/screens/service/index.js
import React, { useContext } from 'react';
import Ventilation from './Ventilation';
import LayoutUnit from './LayoutUnit';
import { ProfileContext } from '../../context/ProfileContext';
import InfoScreen from '../InfoScreen';
import DataMonitor from './DataMonitor';
import Editing from './Editing';

const ServiceRoutes = () => {
  const { isService } = useContext(ProfileContext);

  console.log(isService);

  const allRoutes = [
    { name: 'Ventilation', component: Ventilation, labelKey: 'Ventilation', forService: false },
    { name: 'LayoutUnit', component: LayoutUnit, labelKey: 'LayoutUnit', forService: true },
    { name: 'AdvEditing', component: Editing, labelKey: 'Editing', forService: true },
    //{ name: 'AllData', component: InfoScreen, labelKey: 'All_data', forService: true },
    { name: 'LiveControl', component: DataMonitor, labelKey: 'Data_Monitor', forService: true },
    
  ];

  const filteredRoutes = isService ? allRoutes : allRoutes.filter(route => !route.forService);

  return filteredRoutes;
};

export default ServiceRoutes;
