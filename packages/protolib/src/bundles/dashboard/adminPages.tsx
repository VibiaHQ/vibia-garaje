import { AdminPage } from '../../components/AdminPage';
import { DashboardGrid } from '../../components/DashboardGrid';
import { DashboardCard } from '../../components/DashboardCard';
import { Image } from '../../components/Image';
import { withSession } from '../../lib/Session';
import { XStack, YStack, Text } from '@my/ui';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { Protofy, API } from 'protobase'
import { useState, useEffect } from 'react';
import { getPendingResult } from 'protobase';
import { usePendingEffect } from '../../lib/usePendingEffect';
import { SSR } from '../../lib/SSR';
import { ServiceMemoryUsageChart } from '../services/widgets';

const sourceUrl = '/adminapi/v1/dashboard'
const workspacesSourceUrl = '/adminapi/v1/workspaces'
const isProtected = Protofy("protected", false)



const itemsContent = [
    { key: 'a', content: <DashboardCard id={'a'}><ServiceMemoryUsageChart /></DashboardCard> },
    { key: 'b', content: <DashboardCard title='Box B' id={'b'}><Text>Content B</Text></DashboardCard> },
    { key: 'c', content: 
            <DashboardCard title='Box C' id={'c'}>
                <Text style={{ flex: 1, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Image url="/images/protofito.png" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </Text>
            </DashboardCard> },
    { key: 'd', content: <DashboardCard id={'d'}><Text>Content D</Text></DashboardCard> },
    { key: 'e', content: <DashboardCard id={'e'}><Text>Content E</Text></DashboardCard> },
    { key: 'f', content: <DashboardCard id={'f'}><Text>Content F</Text></DashboardCard> },
  ];

const layouts = {
    lg: [
      { i: 'a', x: 0, y: 0, w: 4, h: 15 },
      { i: 'b', x: 12, y: 0, w: 2, h: 2 },
      { i: 'c', x: 14, y: 0, w: 2, h: 5 },
      { i: 'd', x: 20, y: 0, w: 5, h: 2 },
      { i: 'e', x: 30, y: 0, w: 2, h: 2 },
      { i: 'f', x: 50, y: 0, w: 2, h: 5 },
    ],
    md: [
      { i: 'a', x: 0, y: 0, w: 4, h: 2 },
      { i: 'b', x: 4, y: 0, w: 4, h: 2 },
      { i: 'c', x: 0, y: 2, w: 4, h: 5 },
      { i: 'd', x: 4, y: 2, w: 4, h: 2 },
      { i: 'e', x: 0, y: 7, w: 4, h: 2 },
      { i: 'f', x: 4, y: 7, w: 4, h: 5 },
    ],
    sm: [
      { i: 'a', x: 0, y: 0, w: 2, h: 2 },
      { i: 'b', x: 2, y: 0, w: 2, h: 2 },
      { i: 'c', x: 0, y: 2, w: 2, h: 5 },
      { i: 'd', x: 2, y: 2, w: 2, h: 2 },
      { i: 'e', x: 0, y: 7, w: 2, h: 2 },
      { i: 'f', x: 2, y: 7, w: 2, h: 5 },
    ],
  };


export default {
    'dashboard': {
        component: ({ pageState, initialItems, pageSession, extraData }: any) => {
            const [workspaces, setWorkspaces] = useState(extraData?.workspaces ?? getPendingResult('pending'))
            usePendingEffect((s) => { API.get(workspacesSourceUrl, s) }, setWorkspaces, extraData?.workspaces)
            return (<AdminPage title="Dashboard" pageSession={pageSession}>
                <YStack flex={1} padding={20}>
                    <DashboardGrid items={itemsContent} layouts={layouts} borderRadius={10} padding={10} backgroundColor="white"/>
                </YStack>
            </AdminPage>)
        },
        getServerSideProps: SSR(async (context) => withSession(context, isProtected ? Protofy("permissions", []) : undefined))
    }
}