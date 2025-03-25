import React from "react";
import Image from "next/image";

const SemrushModule: React.FC = () => {
  const cardStyle = {
    textDecoration: "none", 
    border: "1px solid #e2e8f0", 
    borderRadius: "12px", 
    padding: "20px", 
    display: "flex", 
    flexDirection: "column" as const,
    transition: "all 0.2s ease",
    backgroundColor: "white",
    cursor: "pointer",
    height: "100%"
  };

  const cardHoverStyle = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.transform = "translateY(-3px)";
    e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
    e.currentTarget.style.backgroundColor = "#fff5f2";
    const title = e.currentTarget.querySelector('h4');
    if (title) {
      title.style.color = "#ff642d";
    }
  };

  const cardUnhoverStyle = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.boxShadow = "none";
    e.currentTarget.style.backgroundColor = "white";
    const title = e.currentTarget.querySelector('h4');
    if (title) {
      title.style.color = "#1e293b";
    }
  };

  return (
    <div style={{
      maxWidth: "1200px",
      margin: "30px auto",
      backgroundColor: "#f8fafc",
      borderRadius: "12px",
      overflow: "hidden"
    }}>
      <div style={{ 
        textAlign: "center", 
        padding: "40px 30px", 
        backgroundColor: "white", 
        borderRadius: "12px",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      }}>
        <div style={{ height: "28px", position: "relative", display: "inline-block", width: "140px", marginBottom: "24px" }}>
          <Image 
            src="/images/semrush-logo-black-font.png" 
            alt="SEMrush Logo" 
            fill
            style={{ objectFit: "contain" }}
          />
        </div>
        <h2 style={{ 
          fontSize: "30px", 
          fontWeight: 700, 
          marginBottom: "15px",
          color: "#1e293b"
        }}>Is Your SEO Investment Paying Off?</h2>
        <p style={{ 
          fontSize: "16px", 
          color: "#64748b", 
          maxWidth: "600px", 
          margin: "0 auto 40px" 
        }}>
          Your ROI calculations are just the start. Semrush gives you the specialized tools to actually implement high-impact strategies based on your findings.
        </p>
        
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
          gap: "24px",
          marginBottom: "40px"
        }}>
          {/* Competitor Analysis */}
          <a href="https://www.semrush.com/analytics/overview/?searchType=domain" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={cardStyle}
            onMouseOver={cardHoverStyle}
            onMouseOut={cardUnhoverStyle}
          >
            <h4 style={{ 
              fontSize: "18px", 
              margin: "0 0 8px 0", 
              color: "#1e293b",
              transition: "color 0.2s ease"
            }}>Competitor Analysis</h4>
            <p style={{ 
              fontSize: "14px", 
              margin: "0 0 16px 0", 
              color: "#64748b"
            }}>Compare your site against competitors to find performance gaps.</p>
            <div style={{ 
              backgroundImage: "url(/images/domain-overview.webp)", 
              backgroundSize: "cover",
              height: "150px",
              borderRadius: "8px",
              marginTop: "auto"
            }}></div>
          </a>
          
          {/* Keyword Magic Tool */}
          <a href="https://www.semrush.com/analytics/keywordoverview/?db=us" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={cardStyle}
            onMouseOver={cardHoverStyle}
            onMouseOut={cardUnhoverStyle}
          >
            <h4 style={{ 
              fontSize: "18px", 
              margin: "0 0 8px 0", 
              color: "#1e293b",
              transition: "color 0.2s ease"
            }}>Keyword Magic Tool</h4>
            <p style={{ 
              fontSize: "14px", 
              margin: "0 0 16px 0", 
              color: "#64748b"
            }}>Build search strategies based on real customer behavior and intent.</p>
            <div style={{ 
              backgroundImage: "url(/images/keyword_magic_tool.webp)", 
              backgroundSize: "cover",
              height: "150px",
              borderRadius: "8px",
              marginTop: "auto"
            }}></div>
          </a>
          
          {/* Organic Research */}
          <a href="https://www.semrush.com/analytics/organic/overview/?db=us" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={cardStyle}
            onMouseOver={cardHoverStyle}
            onMouseOut={cardUnhoverStyle}
          >
            <h4 style={{ 
              fontSize: "18px", 
              margin: "0 0 8px 0", 
              color: "#1e293b",
              transition: "color 0.2s ease"
            }}>Organic Research</h4>
            <p style={{ 
              fontSize: "14px", 
              margin: "0 0 16px 0", 
              color: "#64748b"
            }}>Analyze top-performing content across your competitive landscape effectively.</p>
            <div style={{ 
              backgroundImage: "url(/images/organic_research.webp)", 
              backgroundSize: "cover",
              height: "150px",
              borderRadius: "8px",
              marginTop: "auto"
            }}></div>
          </a>
          
          {/* Market Explorer */}
          <a href="https://www.semrush.com/market-explorer/" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={cardStyle}
            onMouseOver={cardHoverStyle}
            onMouseOut={cardUnhoverStyle}
          >
            <h4 style={{ 
              fontSize: "18px", 
              margin: "0 0 8px 0", 
              color: "#1e293b",
              transition: "color 0.2s ease"
            }}>Market Explorer</h4>
            <p style={{ 
              fontSize: "14px", 
              margin: "0 0 16px 0", 
              color: "#64748b"
            }}>Identify market trends affecting your business growth and revenue.</p>
            <div style={{ 
              backgroundImage: "url(/images/market-explorer.webp)", 
              backgroundSize: "cover",
              height: "150px",
              borderRadius: "8px",
              marginTop: "auto"
            }}></div>
          </a>
        </div>
        
        <a 
          href="https://www.semrush.com/signup/" 
          target="_blank" 
          rel="noopener noreferrer" 
          style={{ 
            display: "inline-block", 
            padding: "14px 28px", 
            backgroundColor: "#ff642d", 
            color: "white", 
            borderRadius: "8px", 
            textDecoration: "none", 
            fontWeight: "600",
            fontSize: "16px",
            transition: "all 0.2s ease"
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "#e85a29";
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "#ff642d";
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          Try Semrush for Free
        </a>
      </div>
    </div>
  );
};

export default SemrushModule;