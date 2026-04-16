import axios from 'axios';

export class ElfaService {
  private readonly apiKey = process.env.ELFA_API_KEY!;
  private readonly baseUrl = 'https://api.elfa.ai/v2'

  async healthCheck() {
    try {
      const res = await axios.get(`${this.baseUrl}/ping`, {
        headers: {
          'Accept': 'application/json',
          'x-elfa-api-key': this.apiKey
        }
      });
      return res.data;
    } catch (error) {
      console.error('Elfa is Offline');
      return null;
    }
  }

  async getApiStatus() {
    try {
      const res = await axios.get(`${this.baseUrl}/key-status`, {
        headers: {
          'Accept': 'application/json',
          'x-elfa-api-key': this.apiKey
        }
      });
      return res.data;
    } catch (error) {
      console.error('Elfa is Offline');
      return null;
    }
  }

  async getTokenIntelligence(symbol: string) {
    try {
      const res = await axios.get(`${this.baseUrl}/data/top-mentions`, {
        params: { ticker: symbol },
        headers: {
          'x-elfa-api-key': this.apiKey,
          'accept': 'application/json'
        }
      });

      const data = res.data?.data?.[0] || res.data?.[0];

      const smartMentions = data?.smart_mentions_count || 0;
      const sentiment = data?.sentiment_score || 0.5;

      return {
        isBullish: sentiment > 0.6 && smartMentions > 2,
        confidence: sentiment,
        volume: smartMentions
      };
    } catch (error: any) {
      console.error(`Error consulting Elfa for ${symbol}:`, error);
      //IF THE LIMIT FOR ELFA API CALL EXCEEDS WE RETURN A MOCK
      if (error.response?.status === 429) {
        console.warn(`ElfaService Limit exceeded for ${symbol}. Returning fallback data.`);
        return {
          isBullish: true,
          confidence: 0.72,
          volume: 15,
          isFallback: true
        };
      };
    };
  };
};