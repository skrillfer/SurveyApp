import React from 'react';
import { Link } from 'react-router-dom';

import styles from './Navigation.module.css';

import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';

import { AuthUserContext } from '../Session';

const Navigation = () => (
  <div className={styles['navigation']}>
    <AuthUserContext.Consumer>
      {authUser =>
        authUser ? <NavigationAuth /> : <NavigationNonAuth />
      }
    </AuthUserContext.Consumer>
  </div>
);

const NavigationAuth = () => (
  <ul className={styles['navigation-list']}>
    <li className={styles['navigation-list-item']}>
      <Link to={ROUTES.LANDING}>Landing</Link>
    </li >
    <li className={styles['navigation-list-item']}>
      <Link to={ROUTES.HOME}>Home</Link>
    </li>
    <li className={styles['navigation-list-item']}>
      <Link to={ROUTES.ACCOUNT}>Account</Link>
    </li>
    <li className={styles['navigation-list-item']}>
      <Link to={ROUTES.ADMIN}>Admin</Link>
    </li>
    <li className={styles['navigation-list-item']}>
      <Link to={ROUTES.ORGANIZATION}>Organizaciones</Link>
    </li >
    <li className={styles['navigation-list-item']}>
      <SignOutButton />
    </li>
  </ul>
);

const NavigationNonAuth = () => (
  <ul className={styles['navigation-list']}>
    <li className={styles['navigation-list-item']}>
      <Link to={ROUTES.LANDING}>Landing</Link>
    </li>
    <li className={styles['navigation-list-item']}>
      <Link to={ROUTES.SIGN_IN}>Sign In</Link>
    </li>
  </ul>
);

export default Navigation;
