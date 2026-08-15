import React from 'react';
import { GitPullRequest, Layers, CheckCircle2, PackageCheck, Server, ArrowRight } from 'lucide-react';

export const WorkflowGuide: React.FC = () => {
  const stages = [
    {
      step: '1. SCM Checkout',
      desc: 'Jenkins pulls latest commit from GitHub solar-panel-devops repo.',
      icon: GitPullRequest,
      color: '#fbbf24',
    },
    {
      step: '2. Maven Build',
      desc: 'Compiles Spring Boot 3 & SQLite JPA Java classes using JDK 21.',
      icon: Layers,
      color: '#38bdf8',
    },
    {
      step: '3. Automated Test',
      desc: 'Executes SolarPortalApplicationTests JUnit suite with reporting.',
      icon: CheckCircle2,
      color: '#34d399',
    },
    {
      step: '4. Package WAR',
      desc: 'Generates solar-plant-portal.war artefact via maven-war-plugin.',
      icon: PackageCheck,
      color: '#a78bfa',
    },
    {
      step: '5. Server Deploy',
      desc: 'Deploys WAR to Tomcat webapps or updates Nginx upstream endpoint.',
      icon: Server,
      color: '#f43f5e',
    },
  ];

  return (
    <div className="glass-panel" style={{ padding: '24px', marginTop: '28px', borderRadius: '20px', borderColor: 'rgba(245,158,11,0.2)' }}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f59e0b', marginBottom: '8px' }}>
        Lab-4: Jenkins Continuous Integration &amp; Deployment Pipeline Flow
      </h3>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
        Demonstrating end-to-end DevOps automation from Git commit trigger through Maven build &amp; JUnit testing to Tomcat / Nginx deployment target.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '14px', alignItems: 'center' }}>
        {stages.map((stg, idx) => {
          const IconComp = stg.icon;
          return (
            <React.Fragment key={stg.step}>
              <div className="glass-card" style={{ padding: '16px', borderRadius: '14px', background: 'rgba(17,24,39,0.85)', position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <div style={{ background: `${stg.color}20`, padding: '8px', borderRadius: '8px' }}>
                    <IconComp size={18} color={stg.color} />
                  </div>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>{stg.step}</h4>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>{stg.desc}</p>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
