import { Routes } from '@angular/router';
import { HomePage } from './pages/home/home.component';
import { WeatherPage } from './pages/weather/weather.component';
import { TrailsPage } from './pages/trails/trails.component';
import { NaturePage } from './pages/nature/nature.component';
import { ContactPage } from './pages/contact/contact.component';

export const routes: Routes = [
    {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    title: 'Home (kezdőlap)',
    component: HomePage,
  },
    {
    path: 'weather',
    title: 'Weather (időjárás)',
    component: WeatherPage,
    },
    {
    path: 'trails',
    title: 'Trails (túraútvonalak)',
    component: TrailsPage,
    },
    {
    path: 'nature',
    title: 'Nature (természet)',
    component: NaturePage,
    },
    {
    path: 'contact',
    title: 'Contact (kapcsolat)',
    component: ContactPage,
    },
];
