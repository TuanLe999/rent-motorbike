import { Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import 'antd/dist/antd.css';

import { publicRoutes } from './routes';
import DefaultLayout from './layouts/DefaultLayout';

function App() {
    return (
        <Router>
            <ScrollToTop />
            <div className='App'>
                <Routes>
                    {publicRoutes.map((route, key) => {
                        // must use Fragment, use <> </> do not active/work
                        let Layout = DefaultLayout;
                        if (route.layout) {
                            Layout = route.layout;
                        } else if (route.layout === null) {
                            Layout = Fragment;
                        }
                        const Page = route.component;
                        return (
                            <Route
                                key={key}
                                path={route.path}
                                element={
                                    <Layout>
                                        <Page />
                                    </Layout>
                                }
                            ></Route>
                        );
                    })}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
