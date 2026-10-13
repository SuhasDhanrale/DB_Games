/* Editor-maintained demo copy. No live feed or automatic daily rotation.
 * Verify each source before changing a relationship; bump revision when answers change.
 * dateLabel identifies publication, event, or inscription dates explicitly.
 */
window.JodoContent = {
  revision: '2026-10-13.1',
  verifiedOn: '2026-10-13',
  editions: [
    { id: 'd1', title: 'अंतरिक्ष की चार उपलब्धियाँ', freshness: 'आर्काइव · 2014–2024', theme: 'अंतरिक्ष',
      leftOrder: [1, 2, 3, 4], rightOrder: [3, 1, 4, 2], pairs: [
        { id: 'd1-p1', left: 'चंद्रयान-3', right: 'चंद्रमा पर सॉफ्ट लैंडिंग',
          explanation: '23 अगस्त 2023 को विक्रम लैंडर चंद्रमा पर उतरा।',
          why: 'इस उपलब्धि ने चंद्र सतह पर सुरक्षित उतरने और वहीं प्रयोग करने की भारतीय क्षमता दिखाई।',
          source: 'ISRO · मिशन अपडेट', dateLabel: 'घटना: 23 अगस्त 2023', freshness: 'आर्काइव',
          articleTitle: 'चंद्रयान-3 की सफल लैंडिंग', url: 'https://www.isro.gov.in/Chandrayaan3.html' },
        { id: 'd1-p2', left: 'आदित्य-L1', right: 'सूर्य के अध्ययन के लिए L1 की हैलो कक्षा',
          explanation: '6 जनवरी 2024 को आदित्य-L1 अपनी निर्धारित हैलो कक्षा में पहुँचा।',
          why: 'इस कक्षा से सूर्य पर लगातार नज़र रखना संभव है; सूर्य को समझने में अवलोकन का स्थान भी मायने रखता है।',
          source: 'ISRO · प्रेस अपडेट', dateLabel: 'प्रकाशित: 6 जनवरी 2024', freshness: 'आर्काइव',
          articleTitle: 'आदित्य-L1 की हैलो कक्षा में स्थापना', url: 'https://www.isro.gov.in/halo-orbit-insertion-adtya-l1.html' },
        { id: 'd1-p3', left: 'मंगलयान', right: 'मंगल की कक्षा में प्रवेश',
          explanation: '24 सितंबर 2014 को भारत का मंगलयान मंगल की कक्षा में पहुँचा।',
          why: 'किसी दूसरे ग्रह तक पहुँचना और उसकी कक्षा में टिकना अलग चुनौतियाँ हैं। यह खबर अंतरग्रहीय उड़ान की क्षमता बताती है।',
          source: 'PIB · अंतरिक्ष विभाग', dateLabel: 'प्रकाशित: 24 सितंबर 2014', freshness: 'आर्काइव',
          articleTitle: 'मंगल की कक्षा में भारतीय यान', url: 'https://www.pib.gov.in/newsite/PrintRelease.aspx?relid=109972' },
        { id: 'd1-p4', left: 'XPoSat', right: 'खगोलीय एक्स-रे के ध्रुवण का अध्ययन',
          explanation: '1 जनवरी 2024 को PSLV-C58 ने XPoSat को प्रक्षेपित किया। यह एक्स-रे के ध्रुवण को मापने वाला वैज्ञानिक उपग्रह है।',
          why: 'एक्स-रे के गुण मापने से खगोलीय स्रोतों को समझने के लिए नई जानकारी मिलती है; हर अंतरिक्ष मिशन का सवाल अलग होता है।',
          source: 'ISRO · प्रक्षेपण विवरण', dateLabel: 'प्रकाशित: 1 जनवरी 2024', freshness: 'आर्काइव',
          articleTitle: 'PSLV-C58 / XPoSat मिशन', url: 'https://www.isro.gov.in/ISRO_EN/PSLV_C58_XPoSat_Mission.html' }
      ] },
    { id: 'd2', title: 'पेरिस 2024 की चार पदक खबरें', freshness: 'आर्काइव · जुलाई–अगस्त 2024', theme: 'खेल',
      leftOrder: [1, 2, 3, 4], rightOrder: [2, 4, 1, 3], pairs: [
        { id: 'd2-p1', left: 'मनु भाकर', right: 'महिला 10 मीटर एयर पिस्टल में कांस्य',
          explanation: 'पेरिस 2024 में मनु भाकर ने महिला 10 मीटर एयर पिस्टल में कांस्य जीता।',
          why: 'यह भारत की किसी महिला निशानेबाज़ का पहला ओलंपिक पदक था। स्पर्धा का नाम उनकी इस उपलब्धि को ठीक से पहचानता है।',
          source: 'PIB · प्रधानमंत्री कार्यालय', dateLabel: 'प्रकाशित: 28 जुलाई 2024', freshness: 'आर्काइव',
          articleTitle: 'मनु भाकर का 10 मीटर एयर पिस्टल पदक', url: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2038124' },
        { id: 'd2-p2', left: 'नीरज चोपड़ा', right: 'पुरुष भाला फेंक में रजत',
          explanation: 'नीरज चोपड़ा ने पेरिस 2024 के पुरुष भाला फेंक में रजत जीता।',
          why: 'पदक का रंग और स्पर्धा साथ पढ़ने से पेरिस की उपलब्धि को दूसरे ओलंपिक परिणामों से अलग पहचान सकते हैं।',
          source: 'PIB · प्रधानमंत्री कार्यालय', dateLabel: 'प्रकाशित: 9 अगस्त 2024', freshness: 'आर्काइव',
          articleTitle: 'नीरज चोपड़ा का पेरिस रजत', url: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2043412' },
        { id: 'd2-p3', left: 'स्वप्निल कुसाले', right: 'पुरुष 50 मीटर राइफल 3P में कांस्य',
          explanation: 'स्वप्निल कुसाले ने पुरुष 50 मीटर राइफल थ्री पोज़िशन्स में कांस्य जीता।',
          why: 'इस श्रेणी में यह भारत का पहला ओलंपिक पदक था। राइफल और पिस्टल अलग स्पर्धाएँ हैं, इसलिए सिर्फ “निशानेबाज़ी” कहना अधूरा है।',
          source: 'PIB · प्रधानमंत्री कार्यालय', dateLabel: 'प्रकाशित: 1 अगस्त 2024', freshness: 'आर्काइव',
          articleTitle: 'स्वप्निल कुसाले का राइफल पदक', url: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2040111' },
        { id: 'd2-p4', left: 'अमन सहरावत', right: 'पुरुष फ्रीस्टाइल कुश्ती 57 किग्रा में कांस्य',
          explanation: 'अमन सहरावत ने पेरिस 2024 में पुरुष फ्रीस्टाइल कुश्ती के 57 किग्रा वर्ग में कांस्य जीता।',
          why: 'कुश्ती के नतीजे शैली और भार वर्ग से पहचाने जाते हैं। दोनों जानने से खबर का सही संदर्भ मिलता है।',
          source: 'PIB · प्रधानमंत्री कार्यालय', dateLabel: 'प्रकाशित: 9 अगस्त 2024', freshness: 'आर्काइव',
          articleTitle: 'अमन सहरावत का 57 किग्रा पदक', url: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2043947' }
      ] },
    { id: 'd3', title: 'धरोहर की खबरों का संदर्भ', freshness: 'सदाबहार संदर्भ · आज की खबरें नहीं', theme: 'धरोहर',
      leftOrder: [1, 2, 3, 4], rightOrder: [4, 3, 2, 1], pairs: [
        { id: 'd3-p1', left: 'धोलावीरा', right: 'गुजरात · हड़प्पा नगर',
          explanation: 'गुजरात का धोलावीरा हड़प्पा सभ्यता का नगर है, जिसकी जल व्यवस्था उल्लेखनीय है।',
          why: 'धरोहर संरक्षण की खबरों में इसका स्थान और जल प्रबंधन का इतिहास समझना उपयोगी है।',
          source: 'UNESCO · धरोहर अभिलेख', dateLabel: 'सूची में शामिल: 2021', freshness: 'सदाबहार संदर्भ',
          articleTitle: 'धोलावीरा: एक हड़प्पा नगर', url: 'https://whc.unesco.org/en/list/1645/' },
        { id: 'd3-p2', left: 'हम्पी', right: 'कर्नाटक · विजयनगर के अवशेष',
          explanation: 'कर्नाटक में हम्पी के स्मारक विजयनगर साम्राज्य की राजधानी के अवशेष हैं।',
          why: 'यह संबंध संरक्षण की खबरों को एक ऐतिहासिक शहर के संदर्भ में पढ़ने में मदद करता है।',
          source: 'UNESCO · धरोहर अभिलेख', dateLabel: 'सूची में शामिल: 1986', freshness: 'सदाबहार संदर्भ',
          articleTitle: 'हम्पी के स्मारक समूह', url: 'https://whc.unesco.org/en/list/241/' },
        { id: 'd3-p3', left: 'साँची', right: 'मध्य प्रदेश · बौद्ध स्मारक',
          explanation: 'मध्य प्रदेश के साँची में स्तूपों सहित ऐतिहासिक बौद्ध स्मारक हैं।',
          why: 'स्मारकों की पहचान से पर्यटन और संरक्षण की खबरों में धार्मिक और ऐतिहासिक संदर्भ समझ आता है।',
          source: 'UNESCO · धरोहर अभिलेख', dateLabel: 'सूची में शामिल: 1989', freshness: 'सदाबहार संदर्भ',
          articleTitle: 'साँची के बौद्ध स्मारक', url: 'https://whc.unesco.org/en/list/524/' },
        { id: 'd3-p4', left: 'कोणार्क', right: 'ओडिशा · सूर्य का रथ रूपी मंदिर',
          explanation: 'ओडिशा का कोणार्क सूर्य मंदिर सूर्य के रथ के रूप में बनाया गया है।',
          why: 'इस बनावट को जानने से स्थापत्य और धरोहर संरक्षण की खबरों में मंदिर की खासियत समझ आती है।',
          source: 'UNESCO · धरोहर अभिलेख', dateLabel: 'सूची में शामिल: 1984', freshness: 'सदाबहार संदर्भ',
          articleTitle: 'कोणार्क का सूर्य मंदिर', url: 'https://whc.unesco.org/en/list/246/' }
      ] }
  ]
};
