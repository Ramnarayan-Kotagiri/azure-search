import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SearchDataItem } from '@r-ko/ngx-category-search';

// API Item structure
export interface ApiItem {
  id: string;
  name: string;
  // Description exists in data model but won't be displayed per new requirements
  description: string;
}

export interface ApiCategoryData {
  [category: string]: ApiItem[];
}

export interface ApiResponse {
  data: ApiCategoryData;
}

// App-specific data structure
export interface AppSpecificData extends SearchDataItem {
  id: string;
  name: string;
  type: string; // Category
  description: string; // Kept in model, but not for display
  friendlyId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private mockApiData: ApiResponse = {
    data: {
      Compute: [
        { id: "CMP001", name: "EC2 Instance", description: "Virtual servers in the cloud." },
        { id: "CMP002", name: "Lambda Function", description: "Run code without provisioning servers." },
        { id: "CMP003", name: "Elastic Beanstalk", description: "Platform as a Service (PaaS)." },
        { id: "CMP004", name: "Lightsail", description: "Simple virtual private servers." },
        { id: "CMP005", name: "Batch Compute", description: "Run batch computing workloads." },
        { id: "CMP006", name: "Fargate", description: "Serverless compute for containers." },
        { id: "CMP007", name: "Outposts", description: "Run AWS infrastructure on-premises." },
        { id: "CMP008", name: "VMware Cloud on AWS", description: "Migrate VMware workloads." },
        { id: "CMP009", name: "App Runner", description: "Build and run containerized web apps." },
        { id: "CMP010", name: "ECR Public Gallery", description: "Public container image repository." }
      ],
      Storage: [
        { id: "STO001", name: "S3 Bucket", description: "Scalable object storage." },
        { id: "STO002", name: "EBS Volume", description: "Block storage for EC2." },
        { id: "STO003", name: "EFS File System", description: "Scalable file storage for EC2." },
        { id: "STO004", name: "Glacier Archive", description: "Low-cost archive storage." },
        { id: "STO005", name: "Storage Gateway", description: "Hybrid cloud storage." },
        { id: "STO006", name: "FSx for Windows", description: "Managed Windows file server." },
        { id: "STO007", name: "FSx for Lustre", description: "High-performance file system." },
        { id: "STO008", name: "Backup Service", description: "Centralized backup management." },
        { id: "STO009", name: "DataSync", description: "Data transfer service." },
        { id: "STO010", name: "Snowball Edge", description: "Edge computing and data transfer device." }
      ],
      Databases: [
        { id: "DB001", name: "RDS Instance", description: "Managed relational database service." },
        { id: "DB002", name: "DynamoDB Table", description: "NoSQL key-value database." },
        { id: "DB003", name: "ElastiCache Cluster", description: "In-memory caching service." },
        { id: "DB004", name: "Redshift Cluster", description: "Data warehousing service." },
        { id: "DB005", name: "DocumentDB", description: "Managed MongoDB-compatible database." },
        { id: "DB006", name: "Neptune Graph DB", description: "Managed graph database service." },
        { id: "DB007", name: "QLDB Ledger", description: "Quantum Ledger Database." },
        { id: "DB008", name: "Timestream", description: "Time series database." },
        { id: "DB009", name: "Keyspaces (for Cassandra)", description: "Managed Apache Cassandra service." },
        { id: "DB010", name: "Database Migration Service", description: "Migrate databases to AWS." }
      ],
      Networking: [
        { id: "NET001", name: "VPC", description: "Isolated cloud resources." },
        { id: "NET002", name: "Route 53", description: "Scalable DNS web service." },
        { id: "NET003", name: "CloudFront Distribution", description: "Content Delivery Network (CDN)." },
        { id: "NET004", name: "ELB Load Balancer", description: "Distribute incoming application traffic." },
        { id: "NET005", name: "Direct Connect", description: "Dedicated network connection to AWS." },
        { id: "NET006", name: "API Gateway", description: "Create, publish, and manage APIs." },
        { id: "NET007", name: "Transit Gateway", description: "Network hub for VPCs and on-premises." },
        { id: "NET008", name: "Global Accelerator", description: "Improve application availability and performance." },
        { id: "NET009", name: "PrivateLink", description: "Private connectivity to AWS services." },
        { id: "NET010", name: "Cloud Map", description: "Cloud resource discovery service." }
      ],
      MachineLearning: [
        { id: "ML001", name: "SageMaker Studio", description: "IDE for machine learning." },
        { id: "ML002", name: "Rekognition", description: "Image and video analysis." },
        { id: "ML003", name: "Lex Chatbot", description: "Build conversational interfaces." },
        { id: "ML004", name: "Polly Text-to-Speech", description: "Turn text into lifelike speech." },
        { id: "ML005", name: "Translate", description: "Natural and fluent language translation." },
        { id: "ML006", name: "Comprehend", description: "Natural language processing (NLP)." },
        { id: "ML007", name: "Personalize", description: "Real-time personalization and recommendation." },
        { id: "ML008", name: "Forecast", description: "Time-series forecasting service." },
        { id: "ML009", name: "Kendra Intelligent Search", description: "Enterprise search service powered by ML." },
        { id: "ML010", name: "DeepRacer", description: "Autonomous 1/18th scale race car." }
      ]
      // Add more categories and items as desired (Analytics, Security, Developer Tools, etc.)
    }
  };

  constructor() { }

  searchItems(term: string): Observable<ApiResponse> {
    const trimmedTerm = term.trim().toLowerCase();
    if (!trimmedTerm) {
      return of({ data: {} });
    }

    const filteredData: ApiCategoryData = {};
    let hasResults = false;

    for (const category in this.mockApiData.data) {
      const itemsInCategory = this.mockApiData.data[category];
      if (itemsInCategory) {
        // Search only by name as per simplified display requirements
        const categoryResults = itemsInCategory.filter(item =>
          item.name.toLowerCase().includes(trimmedTerm)
        );
        if (categoryResults.length > 0) {
          filteredData[category] = categoryResults;
          hasResults = true;
        }
      }
    }
    return of({ data: hasResults ? filteredData : {} });
  }

  getInitialDataForCategories(): Observable<Record<string, number> | null> {
    const counts: Record<string, number> = {};
    for (const category in this.mockApiData.data) {
      counts[category] = this.mockApiData.data[category].length;
    }
    return of(counts);
  }

  mapApiResponseToSearchData(apiResponse: ApiResponse): AppSpecificData[] {
    const allItems: AppSpecificData[] = [];
    for (const categoryKey in apiResponse.data) {
      const items = apiResponse.data[categoryKey];
      if (items) {
        items.forEach(item => {
          allItems.push({
            id: item.id,
            name: item.name,
            type: categoryKey,
            description: item.description, // Keep in model
            friendlyId: item.id // Using actual ID as friendlyId for simplicity here
          });
        });
      }
    }
    return allItems;
  }
}