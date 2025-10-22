#!/usr/bin/env python3
"""
根据top200.xlsx文件获取QS世界大学排名前200的校徽
从维基百科英文页面获取校徽图片，避免重复下载
"""

import pandas as pd
import requests
import json
import os
import time
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import re

# 创建目录
os.makedirs('image/global-universities', exist_ok=True)

def read_excel_data():
    """读取Excel文件中的大学数据"""
    try:
        df = pd.read_excel('image/top200.xlsx')
        print(f"成功读取Excel文件，共{len(df)}行数据")
        print("列名:", df.columns.tolist())
        print("前5行数据:")
        print(df.head())
        return df
    except Exception as e:
        print(f"读取Excel文件失败: {str(e)}")
        return None

def get_existing_logos():
    """获取已存在的校徽文件列表"""
    existing_files = set()
    if os.path.exists('image/global-universities'):
        for file in os.listdir('image/global-universities'):
            if file.endswith('.png'):
                # 移除.png扩展名并转换为标准格式
                name = file.replace('.png', '').replace('_', ' ').replace('-', ' ')
                existing_files.add(name.lower())
    print(f"已存在{len(existing_files)}个校徽文件")
    return existing_files

def get_wikipedia_logo(university_name, chinese_name, country, rank):
    """从维基百科获取大学校徽"""
    try:
        # 构建维基百科URL
        wiki_name = university_name.replace(' ', '_').replace(',', '').replace('(', '').replace(')', '')
        wiki_url = f"https://en.wikipedia.org/wiki/{wiki_name}"
        print(f"正在获取 {university_name} 的校徽...")
        
        # 发送请求
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(wiki_url, headers=headers, timeout=15)
        response.raise_for_status()
        
        # 解析HTML
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # 查找Infobox中的logo图片
        infobox = soup.find('table', class_='infobox')
        if not infobox:
            print(f"  未找到 {university_name} 的Infobox")
            return None
            
        # 查找logo图片
        logo_img = infobox.find('img')
        if not logo_img:
            print(f"  未找到 {university_name} 的logo图片")
            return None
            
        # 获取图片URL
        img_src = logo_img.get('src')
        if not img_src:
            print(f"  未找到 {university_name} 的图片源")
            return None
            
        # 处理相对URL
        if img_src.startswith('//'):
            img_url = 'https:' + img_src
        elif img_src.startswith('/'):
            img_url = 'https://en.wikipedia.org' + img_src
        else:
            img_url = img_src
            
        print(f"  图片URL: {img_url}")
            
        # 下载图片
        img_response = requests.get(img_url, headers=headers, timeout=15)
        img_response.raise_for_status()
        
        # 保存图片
        safe_name = re.sub(r'[^\w\s-]', '', university_name).strip()
        safe_name = re.sub(r'[-\s]+', '_', safe_name)
        filename = f"{safe_name}.png"
        filepath = os.path.join('image/global-universities', filename)
        
        with open(filepath, 'wb') as f:
            f.write(img_response.content)
            
        print(f"  ✅ 成功保存: {filename}")
        return {
            'rank': rank,
            'name': university_name,
            'chineseName': chinese_name,
            'country': country,
            'logo_path': f'image/global-universities/{filename}',
            'wiki_url': wiki_url
        }
        
    except Exception as e:
        print(f"  ❌ 获取 {university_name} 校徽失败: {str(e)}")
        return None

def main():
    """主函数"""
    print("开始根据top200.xlsx获取QS世界大学排名校徽...")
    print("=" * 60)
    
    # 读取Excel数据
    df = read_excel_data()
    if df is None:
        return
    
    # 获取已存在的校徽文件
    existing_logos = get_existing_logos()
    
    successful_downloads = []
    failed_downloads = []
    skipped_downloads = []
    
    # 处理每一行数据
    for index, row in df.iterrows():
        try:
            # 获取列数据（假设列名是中文名、英文名、国家/地区、QS）
            chinese_name = str(row.iloc[0]) if pd.notna(row.iloc[0]) else ""
            english_name = str(row.iloc[1]) if pd.notna(row.iloc[1]) else ""
            country = str(row.iloc[2]) if pd.notna(row.iloc[2]) else ""
            qs_rank = int(row.iloc[3]) if pd.notna(row.iloc[3]) else index + 1
            
            print(f"\n[{index+1}/200] 处理: {english_name} (QS排名: {qs_rank})")
            
            # 检查是否已存在
            if english_name.lower() in existing_logos:
                print(f"  ⏭️ 跳过，已存在: {english_name}")
                skipped_downloads.append({
                    'rank': qs_rank,
                    'name': english_name,
                    'chineseName': chinese_name,
                    'country': country
                })
                continue
            
            # 获取校徽
            result = get_wikipedia_logo(english_name, chinese_name, country, qs_rank)
            
            if result:
                successful_downloads.append(result)
            else:
                failed_downloads.append({
                    'rank': qs_rank,
                    'name': english_name,
                    'chineseName': chinese_name,
                    'country': country
                })
                
            # 添加延迟避免被封IP
            time.sleep(2)
            
            # 每20个大学显示一次进度
            if (index + 1) % 20 == 0:
                print(f"\n进度: {index+1}/200 完成")
                print(f"成功: {len(successful_downloads)}, 失败: {len(failed_downloads)}, 跳过: {len(skipped_downloads)}")
                
        except Exception as e:
            print(f"处理第{index+1}行数据时出错: {str(e)}")
            continue
    
    # 保存结果到JSON文件
    result_data = {
        'source': 'top200.xlsx',
        'total_processed': len(df),
        'successful_downloads': successful_downloads,
        'failed_downloads': failed_downloads,
        'skipped_downloads': skipped_downloads,
        'success_rate': len(successful_downloads) / len(df) * 100 if len(df) > 0 else 0
    }
    
    with open('qs_universities_result.json', 'w', encoding='utf-8') as f:
        json.dump(result_data, f, ensure_ascii=False, indent=2)
    
    print("\n" + "=" * 60)
    print("QS世界大学排名校徽获取完成!")
    print(f"总处理: {len(df)} 个大学")
    print(f"成功下载: {len(successful_downloads)} 个校徽")
    print(f"下载失败: {len(failed_downloads)} 个")
    print(f"跳过重复: {len(skipped_downloads)} 个")
    print(f"成功率: {result_data['success_rate']:.1f}%")
    
    if failed_downloads:
        print("\n失败的大学:")
        for uni in failed_downloads[:10]:  # 只显示前10个
            print(f"  - {uni['name']} ({uni['country']})")
        if len(failed_downloads) > 10:
            print(f"  ... 还有{len(failed_downloads)-10}个")
    
    print(f"\n结果已保存到: qs_universities_result.json")

if __name__ == "__main__":
    main()
